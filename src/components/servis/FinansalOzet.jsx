import { useState, useMemo } from 'react'
import Modal from '../shared/Modal'

/* ─── Yardımcılar ────────────────────────────────────────── */
const fmt = (v) =>
  Math.abs(parseFloat(v) || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0 })

const LS_GEL = 'servis_ekGelirler'
const LS_GID = 'servis_ekGiderler'

const loadLS = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
const saveLS = (key, data) => localStorage.setItem(key, JSON.stringify(data))

/* ─── Periyot yardımcıları ───────────────────────────────── */
const today = new Date()
const todayStr   = today.toISOString().split('T')[0]
const thisMonth  = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
const thisYear   = String(today.getFullYear())

const inPeriod = {
  gun:  (tarih) => tarih === todayStr,
  ay:   (tarih) => tarih?.startsWith(thisMonth),
  yil:  (tarih) => tarih?.startsWith(thisYear),
}

/* ─── Rakam Satırı ───────────────────────────────────────── */
function Row({ label, value, gizli, cls = 'text-gray-600 dark:text-gray-400', bold, sign }) {
  const formatted = gizli
    ? <span className="text-gray-300 dark:text-gray-600 tracking-widest">•••••</span>
    : <span className={`${bold ? 'text-base font-black' : 'text-sm font-semibold'} ${cls}`}>
        {sign === '-' && value > 0 && '-'}₺{fmt(value)}
      </span>

  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-xs ${bold ? 'font-bold text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
      </span>
      {formatted}
    </div>
  )
}

/* ─── Göz İkonu ──────────────────────────────────────────── */
function EyeBtn({ gizli, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={gizli ? 'Rakamları göster' : 'Rakamları gizle'}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors shrink-0"
    >
      {gizli ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  )
}

/* ─── Ana Finansal Kart ──────────────────────────────────── */
function FinKart({ title, sub, ciro, ekGelir, ekGider, gizli, onToggle, gradient }) {
  const toplamGelir = ciro + ekGelir
  const kar         = toplamGelir - ekGider
  const karPos      = kar >= 0

  return (
    <div className={`rounded-2xl overflow-hidden shadow-md border ${karPos ? 'border-green-100 dark:border-green-900/20' : 'border-red-100 dark:border-red-900/20'}`}>
      {/* Renkli Başlık */}
      <div className={`bg-gradient-to-br ${gradient} px-4 py-3 flex items-center justify-between`}>
        <div>
          <p className="text-white font-black text-sm tracking-widest">{title}</p>
          <p className="text-white/65 text-[11px] mt-0.5">{sub}</p>
        </div>
        <EyeBtn gizli={gizli} onToggle={onToggle} />
      </div>

      {/* Satırlar */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 space-y-0.5">
        <Row label="Servis Ciro"    value={ciro}       gizli={gizli} cls="text-gray-800 dark:text-white" />
        <Row label="Ek Gelir"       value={ekGelir}    gizli={gizli} cls="text-emerald-600 dark:text-emerald-400" />

        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

        <Row label="TOPLAM GELİR"  value={toplamGelir} gizli={gizli} cls="text-gray-800 dark:text-white" bold />
        <Row label="TOPLAM GİDER"  value={ekGider}     gizli={gizli} cls="text-red-500" sign="-" />

        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

        {/* KÂR — özel satır */}
        <div className={`flex items-center justify-between rounded-lg px-2 py-2 mt-1 ${karPos ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <span className="text-xs font-black tracking-wider text-gray-700 dark:text-gray-200">TOPLAM KÂR</span>
          <span className={`font-black text-lg ${karPos ? 'text-emerald-600' : 'text-red-500'}`}>
            {gizli
              ? <span className="text-gray-300 dark:text-gray-600 tracking-widest text-sm">•••••</span>
              : <>{karPos ? '' : '-'}₺{fmt(kar)}</>
            }
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Haftalık Kart ──────────────────────────────────────── */
function HaftaKart({ label, ciro, ekGelir, sayisi, maxToplam, gizli }) {
  const toplam   = ciro + ekGelir
  const pct      = maxToplam > 0 ? (toplam / maxToplam) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>

      {/* Bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <p className={`text-xl font-black leading-tight ${toplam > 0 ? 'text-gray-800 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
        {gizli ? '•••••' : `₺${fmt(toplam)}`}
      </p>

      <div className="flex gap-3 mt-1.5">
        <span className="text-xs text-gray-400">{sayisi} servis</span>
        {ekGelir > 0 && !gizli && (
          <span className="text-xs text-emerald-500">+₺{fmt(ekGelir)} ek</span>
        )}
      </div>
    </div>
  )
}

/* ─── Ek Kayıt Modalı (Gelir / Gider) ───────────────────── */
function EkKayitModal({ tip, kayitlar, onEkle, onSil, onClose }) {
  const [frm, setFrm] = useState({
    tarih: todayStr, tutar: '', aciklama: '',
  })

  const ekle = () => {
    if (!frm.tutar) return
    onEkle({ ...frm, tutar: parseFloat(frm.tutar), id: Date.now() })
    setFrm(f => ({ ...f, tutar: '', aciklama: '' }))
  }

  const isGelir = tip === 'gelir'
  const renk    = isGelir ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
  const inputCls = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300`

  return (
    <Modal isOpen onClose={onClose} title={isGelir ? '💚 Ek Gelir Yönetimi' : '🔴 Ek Gider Yönetimi'} size="md">
      <div className="space-y-5">

        {/* Form */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Yeni Kayıt Ekle</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tarih</label>
              <input type="date" value={frm.tarih} onChange={e => setFrm(f => ({ ...f, tarih: e.target.value }))} className={inputCls + ' mt-1'} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tutar (₺)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
                <input type="number" min="0" step="0.01" placeholder="0,00" value={frm.tutar}
                  onChange={e => setFrm(f => ({ ...f, tutar: e.target.value }))}
                  className={inputCls + ' pl-7'} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Açıklama</label>
            <input type="text" placeholder={isGelir ? 'Kira geliri, komisyon...' : 'Kira, elektrik, malzeme...'} value={frm.aciklama}
              onChange={e => setFrm(f => ({ ...f, aciklama: e.target.value }))}
              className={inputCls + ' mt-1'} />
          </div>
          <button
            onClick={ekle}
            disabled={!frm.tutar}
            className={`w-full py-2 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40 transition-colors ${renk}`}
          >
            {isGelir ? '+ Gelir Ekle' : '- Gider Ekle'}
          </button>
        </div>

        {/* Liste */}
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
            Kayıtlar ({kayitlar.length})
          </p>
          {kayitlar.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Henüz kayıt eklenmedi.</p>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {[...kayitlar].reverse().map(k => (
                <div key={k.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isGelir ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{k.aciklama || '—'}</p>
                    <p className="text-xs text-gray-400">{k.tarih}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${isGelir ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isGelir ? '+' : '-'}₺{(k.tutar || 0).toLocaleString('tr-TR')}
                  </span>
                  <button onClick={() => onSil(k.id)} className="text-gray-300 hover:text-red-500 cursor-pointer text-lg leading-none shrink-0 transition-colors">×</button>
                </div>
              ))}
            </div>
          )}

          {kayitlar.length > 0 && (
            <div className={`mt-3 text-right text-sm font-bold ${isGelir ? 'text-emerald-600' : 'text-red-500'}`}>
              Toplam: {isGelir ? '+' : '-'}₺{fmt(kayitlar.reduce((s, k) => s + (k.tutar || 0), 0))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

/* ─── Ana Bileşen ─────────────────────────────────────────── */
export default function FinansalOzet({ kayitlar }) {
  const [ekGelirler, setEkGelirler] = useState(() => loadLS(LS_GEL))
  const [ekGiderler, setEkGiderler] = useState(() => loadLS(LS_GID))
  const [gelirModal, setGelirModal] = useState(false)
  const [giderModal, setGiderModal] = useState(false)
  const [gizli, setGizli] = useState({ gun: false, ay: false, yil: false, hafta: false })

  const toggleGizli = (key) => setGizli(g => ({ ...g, [key]: !g[key] }))

  /* Ek kayıt işlemleri */
  const ekleGelir = (yeni) => {
    const g = [...ekGelirler, yeni]; setEkGelirler(g); saveLS(LS_GEL, g)
  }
  const silGelir = (id) => {
    const g = ekGelirler.filter(e => e.id !== id); setEkGelirler(g); saveLS(LS_GEL, g)
  }
  const ekleGider = (yeni) => {
    const g = [...ekGiderler, yeni]; setEkGiderler(g); saveLS(LS_GID, g)
  }
  const silGider = (id) => {
    const g = ekGiderler.filter(e => e.id !== id); setEkGiderler(g); saveLS(LS_GID, g)
  }

  /* Hesaplamalar */
  const calc = useMemo(() => {
    const ciro = (fn) => kayitlar.filter(k => fn(k.tarih)).reduce((s, k) => s + (k.tutar || 0), 0)
    const gel  = (fn) => ekGelirler.filter(e => fn(e.tarih)).reduce((s, e) => s + (e.tutar || 0), 0)
    const gid  = (fn) => ekGiderler.filter(e => fn(e.tarih)).reduce((s, e) => s + (e.tutar || 0), 0)

    return {
      gun:  { ciro: ciro(inPeriod.gun),  ekGelir: gel(inPeriod.gun),  ekGider: gid(inPeriod.gun)  },
      ay:   { ciro: ciro(inPeriod.ay),   ekGelir: gel(inPeriod.ay),   ekGider: gid(inPeriod.ay)   },
      yil:  { ciro: ciro(inPeriod.yil),  ekGelir: gel(inPeriod.yil),  ekGider: gid(inPeriod.yil)  },
    }
  }, [kayitlar, ekGelirler, ekGiderler])

  /* Haftalık */
  const haftalar = useMemo(() => {
    const dilimler = [
      { label: '1 – 7. Gün',    s: 1,  e: 7  },
      { label: '8 – 14. Gün',   s: 8,  e: 14 },
      { label: '15 – 21. Gün',  s: 15, e: 21 },
      { label: '22 – Son',      s: 22, e: 31 },
    ]
    return dilimler.map(d => {
      const inWeek = (tarih) => {
        if (!tarih?.startsWith(thisMonth)) return false
        const g = parseInt(tarih.split('-')[2])
        return g >= d.s && g <= d.e
      }
      const wServisler = kayitlar.filter(k => inWeek(k.tarih))
      const ciro   = wServisler.reduce((s, k) => s + (k.tutar || 0), 0)
      const ekGelir = ekGelirler.filter(e => inWeek(e.tarih)).reduce((s, e) => s + (e.tutar || 0), 0)
      return { ...d, ciro, ekGelir, sayisi: wServisler.length }
    })
  }, [kayitlar, ekGelirler])

  const maxHafta = Math.max(...haftalar.map(h => h.ciro + h.ekGelir), 1)

  return (
    <div className="space-y-4">

      {/* ── Başlık + Butonlar ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-gray-800 dark:text-white text-sm tracking-widest uppercase">
            💰 KASA ÖZETİ <span className="text-gray-400 font-semibold normal-case tracking-normal text-xs">(SERVİS & SATIŞ)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGiderModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Ek Giderler
          </button>
          <button
            onClick={() => setGelirModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ek Gelirler
          </button>
        </div>
      </div>

      {/* ── 3 Ana Kart ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinKart
          title="GÜNLÜK"
          sub={today.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' })}
          gradient="from-amber-500 to-orange-600"
          gizli={gizli.gun}
          onToggle={() => toggleGizli('gun')}
          {...calc.gun}
        />
        <FinKart
          title="AYLIK"
          sub={today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          gradient="from-blue-500 to-indigo-600"
          gizli={gizli.ay}
          onToggle={() => toggleGizli('ay')}
          {...calc.ay}
        />
        <FinKart
          title="YILLIK"
          sub={`${thisYear} Yılı Toplamı`}
          gradient="from-violet-500 to-purple-700"
          gizli={gizli.yil}
          onToggle={() => toggleGizli('yil')}
          {...calc.yil}
        />
      </div>

      {/* ── Haftalık Özet ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
            Haftalık Özet — {today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </p>
          <button
            onClick={() => toggleGizli('hafta')}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {gizli.hafta ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
            {gizli.hafta ? 'Göster' : 'Gizle'}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {haftalar.map((h, i) => (
            <HaftaKart
              key={i}
              label={h.label}
              ciro={h.ciro}
              ekGelir={h.ekGelir}
              sayisi={h.sayisi}
              maxToplam={maxHafta}
              gizli={gizli.hafta}
            />
          ))}
        </div>
      </div>

      {/* ── Modaller ── */}
      {gelirModal && (
        <EkKayitModal
          tip="gelir"
          kayitlar={ekGelirler}
          onEkle={ekleGelir}
          onSil={silGelir}
          onClose={() => setGelirModal(false)}
        />
      )}
      {giderModal && (
        <EkKayitModal
          tip="gider"
          kayitlar={ekGiderler}
          onEkle={ekleGider}
          onSil={silGider}
          onClose={() => setGiderModal(false)}
        />
      )}
    </div>
  )
}
