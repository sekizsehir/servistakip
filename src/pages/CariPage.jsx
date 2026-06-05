import { useState, useMemo, useCallback } from 'react'
import Layout from '../components/layout/Layout'
import Modal from '../components/shared/Modal'

/* ─── localStorage ───────────────────────────────────────── */
const LS = { alacak: 'veresiye_alacak', borc: 'veresiye_borc' }
const load = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }
const save = (key, d) => localStorage.setItem(key, JSON.stringify(d))

const INIT_ALACAK = [
  { id: 1, ad: 'Ahmet Yılmaz',  telefon: '0532 111 22 33', adres: 'İstanbul', not: 'Düzenli müşteri', islemler: [
    { id: 1, tip: 'borc',  tutar: 1200, tarih: '2024-01-15', vade: '2024-02-15', aciklama: 'iPhone 14 ekran tamiri' },
    { id: 2, tip: 'odeme', tutar: 500,  tarih: '2024-01-20', vade: null, aciklama: 'Nakit ödeme' },
  ]},
  { id: 2, ad: 'Ayşe Kara',    telefon: '0543 222 33 44', adres: 'Ankara',    not: '', islemler: [
    { id: 3, tip: 'borc', tutar: 450, tarih: '2024-01-16', vade: '2024-01-30', aciklama: 'Samsung şarj sorunu' },
  ]},
  { id: 3, ad: 'Mustafa Demir',telefon: '0555 333 44 55', adres: 'İzmir',     not: '', islemler: [
    { id: 4, tip: 'borc',  tutar: 800, tarih: '2024-01-14', vade: '2024-03-01', aciklama: 'MacBook klavye' },
    { id: 5, tip: 'odeme', tutar: 800, tarih: '2024-01-25', vade: null, aciklama: 'Tam ödeme' },
  ]},
]
const INIT_BORC = [
  { id: 1, ad: 'TechParts A.Ş.', telefon: '0212 111 22 33', adres: 'İstanbul', not: 'Ekran tedarikçisi', islemler: [
    { id: 1, tip: 'borc',  tutar: 5000, tarih: '2024-01-10', vade: '2024-02-10', aciklama: 'Ocak ekran siparişi' },
    { id: 2, tip: 'odeme', tutar: 2000, tarih: '2024-01-20', vade: null, aciklama: 'Kısmi ödeme' },
  ]},
  { id: 2, ad: 'Mobitech Ltd.', telefon: '0312 222 33 44', adres: 'Ankara', not: 'Batarya tedarikçisi', islemler: [
    { id: 3, tip: 'borc', tutar: 1200, tarih: '2024-01-05', vade: '2024-01-20', aciklama: 'Batarya siparişi' },
  ]},
]

/* ─── Yardımcılar ────────────────────────────────────────── */
const today = new Date().toISOString().split('T')[0]
const fmt   = (v) => Math.abs(parseFloat(v) || 0).toLocaleString('tr-TR')
const newId = () => Date.now() + Math.random()

const bakiye = (kisi) =>
  (kisi.islemler || []).reduce((s, i) => s + (i.tip === 'borc' ? i.tutar : -i.tutar), 0)

const sonIslemTarih = (kisi) =>
  (kisi.islemler || []).reduce((max, i) => i.tarih > max ? i.tarih : max, '0000-00-00')

/* ─── Accordion ──────────────────────────────────────────── */
function Accordion({ title, icon, open, onToggle, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2.5 font-semibold text-sm text-gray-700 dark:text-gray-200">
          <span className="text-base">{icon}</span>
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Ortak input cls ────────────────────────────────────── */
const inp = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm
  bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-amber-300 transition`

function Label({ children }) {
  return <label className="block text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1.5">{children}</label>
}

/* ─── Özet Kartlar ───────────────────────────────────────── */
function OzetKartlar({ kisiler }) {
  const toplamAlacak = useMemo(() =>
    kisiler.filter(k => bakiye(k) > 0).reduce((s, k) => s + bakiye(k), 0), [kisiler])

  const bugunOdenecek = useMemo(() =>
    kisiler.reduce((s, k) =>
      s + (k.islemler || []).filter(i => i.vade === today && i.tip === 'borc').reduce((ss, i) => ss + i.tutar, 0)
    , 0), [kisiler])

  const geciken = useMemo(() =>
    kisiler.filter(k => {
      const b = bakiye(k)
      if (b <= 0) return false
      return (k.islemler || []).some(i => i.tip === 'borc' && i.vade && i.vade < today)
    }).reduce((s, k) => {
      const gecBorc = (k.islemler || []).filter(i => i.tip === 'borc' && i.vade && i.vade < today).reduce((ss, i) => ss + i.tutar, 0)
      return s + Math.min(gecBorc, bakiye(k))
    }, 0), [kisiler])

  const kartlar = [
    { label: 'Toplam Alacak',   val: toplamAlacak,  color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-100 dark:border-amber-800', icon: '💰' },
    { label: 'Bugün Ödenecek',  val: bugunOdenecek, color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-100 dark:border-blue-800',   icon: '📅' },
    { label: 'Geciken Borçlar', val: geciken,       color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/20',      border: 'border-red-100 dark:border-red-800',     icon: '⚠️' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {kartlar.map(k => (
        <div key={k.label} className={`rounded-xl border ${k.bg} ${k.border} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{k.label}</span>
            <span className="text-lg">{k.icon}</span>
          </div>
          <p className={`text-2xl font-black ${k.color}`}>₺{fmt(k.val)}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Detay Modalı ───────────────────────────────────────── */
function DetayModal({ kisi, tab, onClose, onEkleIslem, onSilIslem }) {
  const b = bakiye(kisi)
  const [frm, setFrm] = useState({ tip: 'borc', tutar: '', tarih: today, vade: '', aciklama: '' })

  const ekle = () => {
    if (!frm.tutar) return
    onEkleIslem(kisi.id, { id: newId(), ...frm, tutar: parseFloat(frm.tutar) })
    setFrm({ tip: 'borc', tutar: '', tarih: today, vade: '', aciklama: '' })
  }

  return (
    <Modal isOpen onClose={onClose} title={`${kisi.ad} — İşlem Geçmişi`} size="lg">
      <div className="space-y-5">
        {/* Bakiye özeti */}
        <div className={`rounded-xl p-4 flex items-center justify-between ${
          b > 0 ? 'bg-red-50 dark:bg-red-900/20' : b < 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <div>
            <p className="text-xs text-gray-500 font-medium">Mevcut Bakiye</p>
            <p className={`text-2xl font-black ${b > 0 ? 'text-red-600' : b < 0 ? 'text-blue-600' : 'text-green-600'}`}>
              {b > 0 ? '' : b < 0 ? '+' : ''} ₺{fmt(b)}
            </p>
          </div>
          <p className={`text-sm font-bold ${b > 0 ? 'text-red-500' : b < 0 ? 'text-blue-500' : 'text-green-500'}`}>
            {b > 0 ? 'Borçlu' : b < 0 ? 'Alacaklı' : '✓ Temiz'}
          </p>
        </div>

        {/* Hızlı işlem ekle */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hızlı İşlem Ekle</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>İşlem Türü</Label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {['borc', 'odeme'].map(t => (
                  <button key={t} onClick={() => setFrm(f => ({ ...f, tip: t }))}
                    className={`flex-1 py-2 text-sm font-semibold cursor-pointer transition-colors ${frm.tip === t
                      ? t === 'borc' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {t === 'borc' ? '↗ Borç' : '↙ Ödeme'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Tutar (₺)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
                <input type="number" min="0" placeholder="0,00" value={frm.tutar}
                  onChange={e => setFrm(f => ({ ...f, tutar: e.target.value }))}
                  className={inp + ' pl-7'} />
              </div>
            </div>
            <div>
              <Label>Tarih</Label>
              <input type="date" value={frm.tarih} onChange={e => setFrm(f => ({ ...f, tarih: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Vade Tarihi</Label>
              <input type="date" value={frm.vade} onChange={e => setFrm(f => ({ ...f, vade: e.target.value }))} className={inp} />
            </div>
            <div className="col-span-2">
              <Label>Açıklama</Label>
              <input type="text" placeholder="Açıklama..." value={frm.aciklama}
                onChange={e => setFrm(f => ({ ...f, aciklama: e.target.value }))} className={inp} />
            </div>
          </div>
          <button onClick={ekle} disabled={!frm.tutar}
            className={`w-full py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-40 transition-colors ${frm.tip === 'borc' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {frm.tip === 'borc' ? '↗ Borç Ekle' : '↙ Ödeme Ekle'}
          </button>
        </div>

        {/* İşlem listesi */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">İşlem Geçmişi ({kisi.islemler?.length || 0})</p>
          {!kisi.islemler?.length ? (
            <p className="text-sm text-gray-400 text-center py-4">İşlem yok.</p>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {[...kisi.islemler].reverse().map(i => (
                <div key={i.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${i.tip === 'borc' ? 'bg-red-400' : 'bg-green-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{i.aciklama || '—'}</p>
                    <p className="text-xs text-gray-400">{i.tarih}{i.vade ? ` · Vade: ${i.vade}` : ''}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${i.tip === 'borc' ? 'text-red-500' : 'text-green-500'}`}>
                    {i.tip === 'borc' ? '+' : '-'}₺{fmt(i.tutar)}
                  </span>
                  <button onClick={() => onSilIslem(kisi.id, i.id)}
                    className="text-gray-300 hover:text-red-500 cursor-pointer text-lg leading-none shrink-0 transition-colors">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

/* ─── Ana Sayfa ──────────────────────────────────────────── */
export default function CariPage() {
  const [tab, setTab]       = useState('alacak')
  const [alacaklar, _setAl] = useState(() => load(LS.alacak) ?? INIT_ALACAK)
  const [borclarim, _setBo] = useState(() => load(LS.borc)   ?? INIT_BORC)

  const setAl = (fn) => _setAl(prev => { const n = typeof fn === 'function' ? fn(prev) : fn; save(LS.alacak, n); return n })
  const setBo = (fn) => _setBo(prev => { const n = typeof fn === 'function' ? fn(prev) : fn; save(LS.borc,   n); return n })

  const kisiler = tab === 'alacak' ? alacaklar : borclarim
  const setKisiler = tab === 'alacak' ? setAl : setBo

  /* Accordion */
  const [musteriAcc, setMusteriAcc] = useState(false)
  const [islemAcc,   setIslemAcc]   = useState(false)

  /* Müşteri form */
  const [mFrm, setMFrm] = useState({ ad: '', telefon: '', adres: '', not: '' })

  /* İşlem form */
  const [iFrm, setIFrm] = useState({ kisiId: '', tip: 'borc', tutar: '', tarih: today, vade: '', aciklama: '' })

  /* Tablo */
  const [arama,   setArama]   = useState('')
  const [sortKey, setSortKey] = useState('ad')
  const [sortDir, setSortDir] = useState('asc')

  /* Detay */
  const [detayKisi, setDetayKisi] = useState(null)

  /* Handlers */
  const musteriEkle = () => {
    if (!mFrm.ad.trim()) return
    setKisiler(prev => [...prev, { id: newId(), ...mFrm, islemler: [] }])
    setMFrm({ ad: '', telefon: '', adres: '', not: '' })
    setMusteriAcc(false)
  }

  const islemEkle = () => {
    if (!iFrm.kisiId || !iFrm.tutar) return
    const yeniIslem = { id: newId(), tip: iFrm.tip, tutar: parseFloat(iFrm.tutar), tarih: iFrm.tarih, vade: iFrm.vade, aciklama: iFrm.aciklama }
    setKisiler(prev => prev.map(k => k.id == iFrm.kisiId ? { ...k, islemler: [...(k.islemler || []), yeniIslem] } : k))
    setIFrm(f => ({ ...f, tutar: '', vade: '', aciklama: '' }))
    setIslemAcc(false)
  }

  const ekleIslemDetay = useCallback((kisiId, islem) => {
    setKisiler(prev => prev.map(k => k.id === kisiId ? { ...k, islemler: [...(k.islemler || []), islem] } : k))
    setDetayKisi(prev => prev && prev.id === kisiId ? { ...prev, islemler: [...(prev.islemler || []), islem] } : prev)
  }, [setKisiler])

  const silIslem = useCallback((kisiId, islemId) => {
    setKisiler(prev => prev.map(k => k.id === kisiId ? { ...k, islemler: k.islemler.filter(i => i.id !== islemId) } : k))
    setDetayKisi(prev => prev && prev.id === kisiId ? { ...prev, islemler: prev.islemler.filter(i => i.id !== islemId) } : prev)
  }, [setKisiler])

  const kisiSil = (id) => {
    if (!window.confirm('Bu kayıt silinsin mi?')) return
    setKisiler(prev => prev.filter(k => k.id !== id))
  }

  /* Rehberden Aktar */
  const rehberdenAktar = async () => {
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      alert('Bu özellik yalnızca mobil Chrome/Edge tarayıcılarda desteklenir.')
      return
    }
    try {
      const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true })
      if (!contacts.length) return
      const yeniler = contacts.map(c => ({
        id: newId(), ad: c.name?.[0] || '', telefon: c.tel?.[0] || '',
        adres: '', not: '', islemler: [],
      }))
      setKisiler(prev => [...prev, ...yeniler])
    } catch (e) {
      if (e.name !== 'AbortError') alert('Rehber erişimi reddedildi.')
    }
  }

  /* Sıralama + Filtre */
  const toggleSort = (key) => {
    setSortKey(k => { if (k === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return k } setSortDir('asc'); return key })
  }

  const goruntulenen = useMemo(() => {
    let d = kisiler.filter(k =>
      k.ad.toLowerCase().includes(arama.toLowerCase()) ||
      (k.telefon || '').includes(arama)
    )
    d = [...d].sort((a, b) => {
      if (sortKey === 'borc') {
        const av = bakiye(a), bv = bakiye(b)
        return sortDir === 'asc' ? av - bv : bv - av
      }
      if (sortKey === 'son') {
        const av = sonIslemTarih(a), bv = sonIslemTarih(b)
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? a.ad.localeCompare(b.ad, 'tr') : b.ad.localeCompare(a.ad, 'tr')
    })
    return d
  }, [kisiler, arama, sortKey, sortDir])

  const SortBtn = ({ k, label }) => (
    <button onClick={() => toggleSort(k)}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${sortKey === k
        ? 'bg-amber-500 border-amber-500 text-white'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-300'}`}
    >
      {label} {sortKey === k && (sortDir === 'asc' ? '▲' : '▼')}
    </button>
  )

  return (
    <Layout>
      <div className="space-y-5">

        {/* ── Sekmeler ── */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {[
            { key: 'alacak', label: '💰 Alacaklarım', sub: 'Müşteriler' },
            { key: 'borc',   label: '📤 Borçlarım',   sub: 'Tedarikçi / Muhasebe' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span>{t.label}</span>
              <span className="ml-1 text-[11px] text-gray-400 font-normal hidden sm:inline">— {t.sub}</span>
            </button>
          ))}
        </div>

        {/* ── Özet Kartlar ── */}
        <OzetKartlar kisiler={kisiler} />

        {/* ── Accordion: Yeni Müşteri ── */}
        <Accordion
          icon="👤"
          title={tab === 'alacak' ? 'Yeni Müşteri Ekle' : 'Yeni Tedarikçi / Hesap Ekle'}
          open={musteriAcc}
          onToggle={() => setMusteriAcc(o => !o)}
        >
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <Label>Ad Soyad / Ünvan *</Label>
              <input type="text" placeholder="Ad soyad..." value={mFrm.ad}
                onChange={e => setMFrm(f => ({ ...f, ad: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Telefon</Label>
              <input type="tel" placeholder="05XX XXX XX XX" value={mFrm.telefon}
                onChange={e => setMFrm(f => ({ ...f, telefon: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Adres</Label>
              <input type="text" placeholder="İl / İlçe" value={mFrm.adres}
                onChange={e => setMFrm(f => ({ ...f, adres: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Not</Label>
              <input type="text" placeholder="İsteğe bağlı not..." value={mFrm.not}
                onChange={e => setMFrm(f => ({ ...f, not: e.target.value }))} className={inp} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={musteriEkle} disabled={!mFrm.ad.trim()}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-40 transition-colors">
              ✓ Ekle
            </button>
            <button onClick={() => setMusteriAcc(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              İptal
            </button>
          </div>
        </Accordion>

        {/* ── Accordion: İşlem Ekle ── */}
        <Accordion icon="⚡" title="İşlem Ekle (Borç / Ödeme)" open={islemAcc} onToggle={() => setIslemAcc(o => !o)}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
            <div className="col-span-2 lg:col-span-1">
              <Label>Müşteri Seç *</Label>
              <select value={iFrm.kisiId} onChange={e => setIFrm(f => ({ ...f, kisiId: e.target.value }))} className={inp}>
                <option value="">— Seçin —</option>
                {kisiler.map(k => <option key={k.id} value={k.id}>{k.ad}</option>)}
              </select>
            </div>
            <div>
              <Label>İşlem Türü</Label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {[{ k: 'borc', l: '↗ Borç' }, { k: 'odeme', l: '↙ Ödeme' }].map(t => (
                  <button key={t.k} onClick={() => setIFrm(f => ({ ...f, tip: t.k }))}
                    className={`flex-1 py-2 text-sm font-semibold cursor-pointer transition-colors ${iFrm.tip === t.k
                      ? t.k === 'borc' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50'}`}
                  >{t.l}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Tutar (₺)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
                <input type="number" min="0" placeholder="0,00" value={iFrm.tutar}
                  onChange={e => setIFrm(f => ({ ...f, tutar: e.target.value }))} className={inp + ' pl-7'} />
              </div>
            </div>
            <div>
              <Label>İşlem Tarihi</Label>
              <input type="date" value={iFrm.tarih} onChange={e => setIFrm(f => ({ ...f, tarih: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Vade Tarihi</Label>
              <input type="date" value={iFrm.vade} onChange={e => setIFrm(f => ({ ...f, vade: e.target.value }))} className={inp} />
            </div>
            <div>
              <Label>Açıklama</Label>
              <input type="text" placeholder="Fatura no, açıklama..." value={iFrm.aciklama}
                onChange={e => setIFrm(f => ({ ...f, aciklama: e.target.value }))} className={inp} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={islemEkle} disabled={!iFrm.kisiId || !iFrm.tutar}
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer disabled:opacity-40 transition-colors ${iFrm.tip === 'borc' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {iFrm.tip === 'borc' ? '↗ Borç Ekle' : '↙ Ödeme Ekle'}
            </button>
            <button onClick={() => setIslemAcc(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              İptal
            </button>
          </div>
        </Accordion>

        {/* ── Tablo Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-72">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Ad veya telefon ara..."
              value={arama} onChange={e => setArama(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {arama && <button onClick={() => setArama('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none">×</button>}
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-gray-400">Sırala:</span>
            <SortBtn k="ad"  label="İsim" />
            <SortBtn k="borc" label="Borç" />
            <SortBtn k="son" label="Son Gelen" />
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={rehberdenAktar}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-amber-300 hover:text-amber-600 cursor-pointer transition-colors bg-white dark:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Rehberden Aktar
            </button>
            <button onClick={() => setMusteriAcc(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold cursor-pointer transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ekle
            </button>
          </div>
        </div>

        {/* ── Tablo ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                {['MÜŞTERİ', 'TELEFON', 'TOPLAM BORÇ', 'DURUM', 'İŞLEM'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {goruntulenen.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-14 text-gray-400">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm">{arama ? 'Eşleşen kayıt bulunamadı.' : 'Henüz kayıt yok.'}</p>
                </td></tr>
              ) : goruntulenen.map((k, i) => {
                const b = bakiye(k)
                const overdue = b > 0 && (k.islemler || []).some(i => i.tip === 'borc' && i.vade && i.vade < today)
                return (
                  <tr key={k.id} className={`border-b border-gray-50 dark:border-gray-700/50 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors ${i % 2 !== 0 ? 'bg-gray-50/40 dark:bg-gray-800/30' : ''}`}>
                    {/* Müşteri */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                          {k.ad.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white text-xs">{k.ad}</p>
                          {k.adres && <p className="text-[11px] text-gray-400">{k.adres}</p>}
                          {k.not && <p className="text-[10px] text-amber-500 italic truncate max-w-28">{k.not}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Telefon */}
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{k.telefon || '—'}</td>
                    {/* Borç */}
                    <td className="px-4 py-3">
                      <p className={`text-sm font-black ${b > 0 ? 'text-red-500' : b < 0 ? 'text-blue-500' : 'text-green-500'}`}>
                        {b > 0 ? '' : b < 0 ? '+' : ''}₺{fmt(b)}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{(k.islemler || []).length} işlem</p>
                    </td>
                    {/* Durum */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        overdue
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : b > 0
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : b < 0
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {overdue ? '⚠️ Gecikmiş' : b > 0 ? 'Borçlu' : b < 0 ? 'Alacaklı' : '✓ Temiz'}
                      </span>
                    </td>
                    {/* İşlem */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* WA Hatırlatma */}
                        <button title="WhatsApp Hatırlatma"
                          onClick={() => {
                            const no = (k.telefon || '').replace(/\D/g, '')
                            const tam = no.startsWith('90') ? no : `90${no.replace(/^0/, '')}`
                            const msg = b > 0
                              ? `Sayın ${k.ad}, ₺${fmt(b)} tutarında borcunuz bulunmaktadır. Ödemenizi bekliyoruz.`
                              : `Sayın ${k.ad}, hesabınız güncel durumu hakkında bilgi almak için arayabilirsiniz.`
                            window.open(`https://wa.me/${tam}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                        {/* Detay */}
                        <button title="İşlem Geçmişi & Detay"
                          onClick={() => setDetayKisi(k)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-amber-500 cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </button>
                        {/* Sil */}
                        <button title="Kaydı Sil" onClick={() => kisiSil(k.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Tablo footer */}
          {goruntulenen.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
              <span>{goruntulenen.length} kayıt</span>
              <span>
                Toplam alacak: <strong className={`${goruntulenen.filter(k => bakiye(k) > 0).reduce((s, k) => s + bakiye(k), 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₺{fmt(goruntulenen.filter(k => bakiye(k) > 0).reduce((s, k) => s + bakiye(k), 0))}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Detay Modal */}
      {detayKisi && (
        <DetayModal
          kisi={detayKisi}
          tab={tab}
          onClose={() => setDetayKisi(null)}
          onEkleIslem={ekleIslemDetay}
          onSilIslem={silIslem}
        />
      )}
    </Layout>
  )
}
