import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Layout from '../components/layout/Layout'

/* ─── localStorage ───────────────────────────────────────── */
const LS = { tasks: 'gorevler', notes: 'hizli_notlar', pom: 'pomodoro_stats' }
const load = (k, def) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? def } catch { return def } }
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))

/* ─── Tarih yardımcıları ─────────────────────────────────── */
const todayStr = new Date().toISOString().split('T')[0]
const nextWeek = (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0] })()

const displayDate = (d) => {
  if (!d) return ''
  if (d === todayStr) return 'Bugün'
  const dt = new Date(d + 'T00:00')
  const diff = Math.round((dt - new Date(todayStr + 'T00:00')) / 86400000)
  if (diff === 1) return 'Yarın'
  if (diff === -1) return 'Dün'
  if (diff < -1) return `${Math.abs(diff)} gün geçti`
  if (diff < 7) return ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][dt.getDay()]
  return dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

/* ─── Doğal dil parser ───────────────────────────────────── */
const GUNLER = ['pazar','pazartesi','salı','sali','çarşamba','carsamba','perşembe','persembe','cuma','cumartesi']
const GUNLER_IDX = { 'pazar':0,'pazartesi':1,'salı':2,'sali':2,'çarşamba':3,'carsamba':3,'perşembe':4,'persembe':4,'cuma':5,'cumartesi':6 }

function parseGorev(raw) {
  let text = raw
  let date  = null, time  = null
  let priority = 'orta'
  const tags = []

  // Öncelik: !acil !yüksek !orta !düşük
  text = text.replace(/!(\S+)/g, (_, p) => {
    const lp = p.toLowerCase()
    if (['acil'].includes(lp)) priority = 'acil'
    else if (['yüksek','yuksek'].includes(lp)) priority = 'yuksek'
    else if (['düşük','dusuk'].includes(lp)) priority = 'dusuk'
    else priority = 'orta'
    return ''
  })

  // Tag: #etiket
  text = text.replace(/#(\S+)/g, (_, t) => { tags.push(t); return '' })

  // Saat: 14:00 veya 14.00
  const timeMatch = text.match(/\b(\d{1,2})[:\.](\d{2})\b/)
  if (timeMatch) { time = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`; text = text.replace(timeMatch[0], '') }

  // Tarih anahtar kelimeleri
  const today = new Date()
  const relative = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().split('T')[0] }

  text = text.replace(/öbür\s*gün|obur\s*gun/gi, () => { date = relative(2); return '' })
  text = text.replace(/yarın|yarin/gi,  () => { date = relative(1); return '' })
  text = text.replace(/bugün|bugun/gi,  () => { date = relative(0); return '' })

  if (!date) {
    for (const [g, i] of Object.entries(GUNLER_IDX)) {
      const re = new RegExp(`\\b${g}\\b`, 'gi')
      if (re.test(text)) {
        const todayDay = today.getDay()
        let diff = i - todayDay
        if (diff <= 0) diff += 7
        date = relative(diff)
        text = text.replace(re, '')
        break
      }
    }
  }

  // Gün/ay formatı: 15/03 veya 15.03
  if (!date) {
    const dm = text.match(/\b(\d{1,2})[\/\.](\d{1,2})(?:[\/\.](\d{2,4}))?\b/)
    if (dm) {
      const y = dm[3] ? (dm[3].length === 2 ? '20' + dm[3] : dm[3]) : today.getFullYear()
      date = `${y}-${dm[2].padStart(2,'0')}-${dm[1].padStart(2,'0')}`
      text = text.replace(dm[0], '')
    }
  }

  const title = text.replace(/\s+/g, ' ').trim()
  return { title: title || raw.trim(), date: date || todayStr, time, priority, tags }
}

/* ─── Öncelik stilleri ───────────────────────────────────── */
const PRIO = {
  acil:   { cls: 'bg-red-100    text-red-700    border-red-300    dark:bg-red-900/30    dark:text-red-300',    dot: 'bg-red-500',    label: '🔴 Acil'   },
  yuksek: { cls: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300', dot: 'bg-orange-500', label: '🟠 Yüksek' },
  orta:   { cls: 'bg-blue-100   text-blue-700   border-blue-300   dark:bg-blue-900/30   dark:text-blue-300',   dot: 'bg-blue-500',   label: '🔵 Orta'   },
  dusuk:  { cls: 'bg-gray-100   text-gray-500   border-gray-200   dark:bg-gray-800      dark:text-gray-400',   dot: 'bg-gray-400',   label: '⚫ Düşük'  },
}

/* ─── Görev kategorisi ───────────────────────────────────── */
const kategori = (t) => {
  if (t.completed) return 'tamamlanan'
  if (!t.date || t.date < todayStr) return 'geciken'
  if (t.date === todayStr) return 'bugun'
  if (t.date <= nextWeek) return 'yaklasan'
  return 'yaklasan'
}

/* ─── Pomodoro ───────────────────────────────────────────── */
const POM_DUR = 25 * 60

function Pomodoro() {
  const [secs,     setSecs]     = useState(POM_DUR)
  const [running,  setRunning]  = useState(false)
  const [sessions, setSessions] = useState(() => load(LS.pom, { bugun: 0, toplam: 0, dakika: 0 }))
  const interval = useRef(null)

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(interval.current)
            setRunning(false)
            setSessions(prev => {
              const n = { bugun: prev.bugun + 1, toplam: prev.toplam + 1, dakika: prev.dakika + 25 }
              save(LS.pom, n)
              return n
            })
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Pomodoro Tamamlandı! 🍅', { body: '25 dakika bitti, mola zamanı!' })
            }
            return POM_DUR
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(interval.current)
    }
    return () => clearInterval(interval.current)
  }, [running])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const pct = ((POM_DUR - secs) / POM_DUR) * 100
  const circumference = 2 * Math.PI * 54

  const requestNotif = () => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">🍅 Pomodoro</h3>
          <p className="text-xs text-gray-400">25 dakika odaklanma</p>
        </div>
        <button onClick={requestNotif} title="Bildirim izni ver"
          className="text-gray-300 hover:text-amber-500 cursor-pointer transition-colors text-lg">🔔</button>
      </div>

      {/* Dairesel sayaç */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="8" className="dark:stroke-gray-700" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={running ? '#f59e0b' : '#d1d5db'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black tabular-nums ${running ? 'text-amber-500' : 'text-gray-700 dark:text-gray-200'}`}>
              {mm}:{ss}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">{running ? 'çalışıyor' : 'hazır'}</span>
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-2">
        <button
          onClick={() => setRunning(r => !r)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            running
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {running ? '⏸ Duraklat' : '▶ Başlat'}
        </button>
        <button
          onClick={() => { setSecs(POM_DUR); setRunning(false) }}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm transition-colors"
          title="Sıfırla"
        >↺</button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: 'Bugün', val: sessions.bugun },
          { label: 'Toplam', val: sessions.toplam },
          { label: 'Dakika', val: sessions.dakika },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 text-center">
            <p className="text-base font-black text-gray-800 dark:text-white">{s.val}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Hızlı Notlar ───────────────────────────────────────── */
function HizliNotlar() {
  const [notlar, setNotlar] = useState(() => load(LS.notes, []))
  const [text, setText]     = useState('')

  const ekle = () => {
    if (!text.trim()) return
    const n = [...notlar, { id: Date.now(), text: text.trim(), tarih: new Date().toLocaleString('tr-TR') }]
    setNotlar(n); save(LS.notes, n); setText('')
  }
  const sil = (id) => { const n = notlar.filter(n => n.id !== id); setNotlar(n); save(LS.notes, n) }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3">
      <h3 className="font-bold text-gray-800 dark:text-white text-sm">📝 Hızlı Notlar</h3>

      <div className="flex gap-2">
        <textarea
          rows={2}
          placeholder="Hızlı not yaz..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ekle() } }}
          className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
        />
        <button onClick={ekle} disabled={!text.trim()}
          className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer disabled:opacity-40 transition-colors self-start">
          +
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notlar.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">Henüz not yok.</p>
        ) : (
          [...notlar].reverse().map(n => (
            <div key={n.id} className="flex gap-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-3 py-2.5 border border-amber-100 dark:border-amber-800/30">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 dark:text-gray-300 break-words">{n.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{n.tarih}</p>
              </div>
              <button onClick={() => sil(n.id)} className="text-gray-300 hover:text-red-500 cursor-pointer text-base leading-none shrink-0 transition-colors mt-0.5">×</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Görev satırı ───────────────────────────────────────── */
function GorevSatir({ gorev, onToggle, onSil }) {
  const kat = kategori(gorev)
  const prio = PRIO[gorev.priority] || PRIO.orta

  const solBorder = {
    geciken:    'border-l-red-400',
    bugun:      'border-l-blue-400',
    yaklasan:   'border-l-amber-400',
    tamamlanan: 'border-l-green-400',
  }[kat]

  return (
    <div className={`group flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border-l-4 ${solBorder} border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm hover:shadow-md transition-all`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={gorev.completed}
        onChange={() => onToggle(gorev.id)}
        className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
      />

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${gorev.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
          {gorev.title}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {/* Tarih/Saat */}
          {gorev.date && (
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
              kat === 'geciken' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
              kat === 'bugun'   ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              📅 {displayDate(gorev.date)}{gorev.time ? ` ${gorev.time}` : ''}
            </span>
          )}
          {/* Öncelik */}
          {gorev.priority !== 'orta' && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${prio.cls}`}>
              {prio.label}
            </span>
          )}
          {/* Taglar */}
          {(gorev.tags || []).map(t => (
            <span key={t} className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Sil */}
      <button
        onClick={() => onSil(gorev.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 cursor-pointer text-lg leading-none transition-all shrink-0"
      >×</button>
    </div>
  )
}

/* ─── Ana Sayfa ──────────────────────────────────────────── */
const INIT_TASKS = [
  { id: 1, title: 'Faturalar ödenmeli', date: todayStr, time: '10:00', priority: 'acil',   tags: ['finans'],   completed: false },
  { id: 2, title: 'Stok sayımı yap',    date: todayStr, time: null,    priority: 'orta',   tags: ['stok'],     completed: false },
  { id: 3, title: 'Müşteri takibi',     date: todayStr, time: '15:30', priority: 'yuksek', tags: ['müşteri'],  completed: true  },
]

export default function IslerPage() {
  const [gorevler, setGorevler] = useState(() => load(LS.tasks, INIT_TASKS))
  const [input,    setInput]    = useState('')
  const [arama,    setArama]    = useState('')
  const [aramaAcik,setAramaAcik]= useState(false)
  const inputRef   = useRef(null)
  const aramaRef   = useRef(null)

  /* / kısayolu ile arama aç */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        setAramaAcik(true)
        setTimeout(() => aramaRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') { setAramaAcik(false); setArama('') }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  /* Görev ekle */
  const gorevEkle = useCallback(() => {
    if (!input.trim()) return
    const parsed = parseGorev(input.trim())
    if (!parsed.title) return
    const yeni = { id: Date.now(), ...parsed, completed: false }
    setGorevler(prev => { const n = [yeni, ...prev]; save(LS.tasks, n); return n })
    setInput('')
    inputRef.current?.focus()
  }, [input])

  const toggleGorev = useCallback((id) => {
    setGorevler(prev => { const n = prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g); save(LS.tasks, n); return n })
  }, [])

  const silGorev = useCallback((id) => {
    setGorevler(prev => { const n = prev.filter(g => g.id !== id); save(LS.tasks, n); return n })
  }, [])

  /* Filtrelenmiş görevler */
  const goruntulenen = useMemo(() => {
    if (!arama.trim()) return gorevler
    const q = arama.toLowerCase()
    return gorevler.filter(g =>
      g.title.toLowerCase().includes(q) ||
      (g.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }, [gorevler, arama])

  /* Gruplar */
  const gruplar = useMemo(() => ({
    geciken:    goruntulenen.filter(g => !g.completed && g.date && g.date < todayStr),
    bugun:      goruntulenen.filter(g => !g.completed && g.date === todayStr),
    yaklasan:   goruntulenen.filter(g => !g.completed && g.date > todayStr),
    tamamlanan: goruntulenen.filter(g => g.completed),
  }), [goruntulenen])

  /* Stat kartları */
  const stats = [
    { key: 'geciken',    label: 'GECİKEN',    count: gorevler.filter(g => !g.completed && g.date && g.date < todayStr).length, border: 'border-l-red-500',   bg: 'bg-red-50 dark:bg-red-900/20',    text: 'text-red-600',   icon: '⚠️' },
    { key: 'bugun',      label: 'BUGÜN',       count: gorevler.filter(g => !g.completed && g.date === todayStr).length,          border: 'border-l-blue-500',  bg: 'bg-blue-50 dark:bg-blue-900/20',  text: 'text-blue-600',  icon: '📅' },
    { key: 'yaklasan',   label: 'YAKLAŞAN',    count: gorevler.filter(g => !g.completed && g.date > todayStr).length,            border: 'border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20',text: 'text-amber-600', icon: '⏰' },
    { key: 'tamamlanan', label: 'TAMAMLANAN',  count: gorevler.filter(g => g.completed).length,                                   border: 'border-l-green-500', bg: 'bg-green-50 dark:bg-green-900/20',text: 'text-green-600', icon: '✅' },
  ]

  const GrupBaslik = ({ label, count, color }) => count > 0 ? (
    <div className="flex items-center gap-2 mb-2 mt-4">
      <span className={`text-xs font-black tracking-widest uppercase ${color}`}>{label}</span>
      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">{count}</span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
    </div>
  ) : null

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* ── SOL KOLON ── */}
        <div className="space-y-5">

          {/* İstatistik kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.key} className={`${s.bg} rounded-xl border-l-4 ${s.border} border border-gray-100 dark:border-gray-700 p-4`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <span className={`text-2xl font-black ${s.text}`}>{s.count}</span>
                </div>
                <p className={`text-[11px] font-bold tracking-widest uppercase ${s.text}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Hızlı görev ekleme */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl">⚡</span>
              <input
                ref={inputRef}
                type="text"
                placeholder='Hızlı ekle: "yarın 14:00 toplantı !acil #randevu" → Enter'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') gorevEkle() }}
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={gorevEkle}
                disabled={!input.trim()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer disabled:opacity-40 transition-colors shrink-0"
              >Ekle ↵</button>
            </div>

            {/* Önizleme */}
            {input.trim() && (() => {
              const p = parseGorev(input.trim())
              return (
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 bg-amber-50/50 dark:bg-amber-900/10 flex flex-wrap gap-2 text-xs">
                  <span className="text-gray-500">Önizleme:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{p.title || '—'}</span>
                  {p.date && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 rounded">📅 {displayDate(p.date)}{p.time ? ` ${p.time}` : ''}</span>}
                  {p.priority !== 'orta' && <span className={`px-1.5 rounded border ${PRIO[p.priority]?.cls}`}>{PRIO[p.priority]?.label}</span>}
                  {p.tags.map(t => <span key={t} className="bg-amber-100 text-amber-700 px-1.5 rounded">#{t}</span>)}
                </div>
              )
            })()}

            {/* İpuçları */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex flex-wrap gap-3 text-[10px] text-gray-400">
              <span>📅 yarın / bugün / pazartesi / 15.03</span>
              <span>🕐 14:30</span>
              <span>🔴 !acil !yüksek !düşük</span>
              <span>🏷️ #tag</span>
            </div>
          </div>

          {/* Arama kutusu */}
          <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl border shadow-sm px-4 py-2.5 transition-all ${
            aramaAcik ? 'border-amber-300 ring-2 ring-amber-200 dark:ring-amber-800' : 'border-gray-100 dark:border-gray-700'
          }`}>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={aramaRef}
              type="text"
              placeholder="Görev ara... (/ ile aç)"
              value={arama}
              onChange={e => setArama(e.target.value)}
              onFocus={() => setAramaAcik(true)}
              onBlur={() => { if (!arama) setAramaAcik(false) }}
              className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
            />
            {arama && (
              <button onClick={() => { setArama(''); setAramaAcik(false) }} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none">×</button>
            )}
            <kbd className="hidden sm:inline text-[10px] border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-gray-400 bg-gray-50 dark:bg-gray-700">/</kbd>
          </div>

          {/* Görev listesi */}
          <div className="space-y-1.5">
            {goruntulenen.length === 0 ? (
              <div className="text-center py-14 text-gray-400">
                <p className="text-4xl mb-3">🎯</p>
                <p className="font-medium text-sm">{arama ? `"${arama}" ile eşleşen görev yok.` : 'Tüm görevler tamamlandı! 🎉'}</p>
              </div>
            ) : (
              <>
                <GrupBaslik label="⚠️ Geciken"   count={gruplar.geciken.length}    color="text-red-500" />
                {gruplar.geciken.map(g => <GorevSatir key={g.id} gorev={g} onToggle={toggleGorev} onSil={silGorev} />)}

                <GrupBaslik label="📅 Bugün"      count={gruplar.bugun.length}      color="text-blue-500" />
                {gruplar.bugun.map(g => <GorevSatir key={g.id} gorev={g} onToggle={toggleGorev} onSil={silGorev} />)}

                <GrupBaslik label="⏰ Yaklaşan"   count={gruplar.yaklasan.length}   color="text-amber-600" />
                {gruplar.yaklasan.map(g => <GorevSatir key={g.id} gorev={g} onToggle={toggleGorev} onSil={silGorev} />)}

                <GrupBaslik label="✅ Tamamlanan" count={gruplar.tamamlanan.length} color="text-green-500" />
                {gruplar.tamamlanan.map(g => <GorevSatir key={g.id} gorev={g} onToggle={toggleGorev} onSil={silGorev} />)}
              </>
            )}
          </div>

          {/* Tamamlananları temizle */}
          {gruplar.tamamlanan.length > 0 && (
            <button
              onClick={() => {
                if (!window.confirm('Tamamlanan görevler silinsin mi?')) return
                setGorevler(prev => { const n = prev.filter(g => !g.completed); save(LS.tasks, n); return n })
              }}
              className="w-full py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 cursor-pointer transition-colors"
            >
              🗑 Tamamlananları temizle ({gruplar.tamamlanan.length})
            </button>
          )}
        </div>

        {/* ── SAĞ PANEL ── */}
        <div className="space-y-4">
          <Pomodoro />
          <HizliNotlar />
        </div>

      </div>
    </Layout>
  )
}
