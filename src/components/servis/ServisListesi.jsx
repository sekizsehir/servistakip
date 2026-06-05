import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { getCihaz } from '../../data/mock'
import BaskiModal from './BaskiModal'
import WhatsAppModal from './WhatsAppModal'

/* ─── Sabitler ───────────────────────────────────────────── */
const MIN_W = 50

const FILTRELER = [
  { key: 'Tümü',         icon: '📋', label: 'Tümü' },
  { key: 'Randevu',      icon: '📅', label: 'Randevu' },
  { key: 'Beklemede',    icon: '⏳', label: 'Beklemede' },
  { key: 'Tamirde',      icon: '🔧', label: 'Tamirde' },
  { key: 'Hazır',        icon: '✅', label: 'Hazır' },
  { key: 'Teslim Edildi',icon: '📦', label: 'Teslim' },
  { key: 'İade',         icon: '↩️', label: 'İade' },
]

const SUTUNLAR = [
  { key: 'gorsel',  label: 'Görsel',   w: 64,  sort: false, hide: true  },
  { key: 'tarih',   label: 'Tarih',    w: 96,  sort: true,  hide: true  },
  { key: 'musteri', label: 'Müşteri',  w: 160, sort: true,  hide: false },
  { key: 'cihaz',   label: 'Cihaz',    w: 175, sort: true,  hide: true  },
  { key: 'ariza',   label: 'Arıza',    w: 185, sort: false, hide: true  },
  { key: 'ucret',   label: 'Ücret',    w: 145, sort: true,  hide: true  },
  { key: 'durum',   label: 'Durum',    w: 148, sort: true,  hide: false },
  { key: 'islem',   label: 'İşlem',    w: 220, sort: false, hide: false },
]

const DS = {
  'Randevu':      'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
  'Beklemede':    'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  'Tamirde':      'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  'Hazır':        'bg-green-100  text-green-700  border-green-200  dark:bg-green-900/30  dark:text-green-300  dark:border-green-700',
  'Teslim Edildi':'bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-900/30   dark:text-blue-300   dark:border-blue-700',
  'İade':         'bg-red-100    text-red-700    border-red-200    dark:bg-red-900/30    dark:text-red-300    dark:border-red-700',
}

const DURUMLAR = ['Randevu', 'Beklemede', 'Tamirde', 'Hazır', 'Teslim Edildi', 'İade']

/* ─── Print yardımcıları ─────────────────────────────────── */
const fmt = (v, d = 2) => (parseFloat(v) || 0).toLocaleString('tr-TR', { minimumFractionDigits: d })

function printMusteriFis(k) {
  const kalan = (k.tutar || 0) - (k.odenen || 0)
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
  <title>Müşteri Fişi #${k.id}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:monospace;font-size:12px;width:80mm;padding:10px;color:#000}
  .c{text-align:center}.b{font-weight:bold}.l{border-top:1px dashed #555;margin:6px 0}
  .row{display:flex;justify-content:space-between;padding:2px 0}.big{font-size:16px}
  @media print{body{width:80mm}}</style></head><body>
  <div class="c b" style="font-size:18px">G SERVİS TAKİP</div>
  <div class="c" style="font-size:11px;color:#555">Teknik Servis</div>
  <div class="l"></div>
  <div class="row"><span>Fiş No:</span><span class="b">#${k.id}</span></div>
  <div class="row"><span>Tarih:</span><span>${k.tarih || '—'}</span></div>
  <div class="l"></div>
  <div class="row"><span>Müşteri:</span><span class="b">${k.musteri || '—'}</span></div>
  <div class="row"><span>Telefon:</span><span>${k.telefon || '—'}</span></div>
  <div class="l"></div>
  <div class="row"><span>Cihaz:</span><span class="b">${getCihaz(k)}</span></div>
  <div class="row"><span>Arıza:</span><span style="max-width:160px;text-align:right">${k.ariza || '—'}</span></div>
  <div class="row"><span>Durum:</span><span class="b">${k.durum || '—'}</span></div>
  <div class="l"></div>
  <div class="row"><span>Toplam:</span><span class="b">₺${fmt(k.tutar)}</span></div>
  <div class="row"><span>Ödenen:</span><span>₺${fmt(k.odenen)}</span></div>
  <div class="row big b"><span>KALAN:</span><span>₺${fmt(kalan)}</span></div>
  <div class="l"></div>
  <div class="c" style="font-size:10px;color:#888;margin-top:8px">Teşekkür ederiz · G Servis Takip</div>
  <script>window.onload=()=>{window.print()}</script></body></html>`
  const w = window.open('', '_blank', 'width=400,height=600')
  if (w) { w.document.write(html); w.document.close() }
}

function printCihazEtiketi(k) {
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
  <title>Cihaz Etiketi #${k.id}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;width:90mm;height:35mm;padding:6px;border:2px solid #1f2937;font-size:11px;display:flex;flex-direction:column;gap:3px}
  .top{display:flex;justify-content:space-between;align-items:center}
  .logo{font-weight:900;color:#f59e0b;font-size:13px}.no{font-size:10px;color:#6b7280}
  .cihaz{font-weight:700;font-size:13px}.row{display:flex;gap:8px;font-size:10px;color:#374151}
  .badge{background:#f59e0b;color:white;border-radius:3px;padding:1px 5px;font-size:9px;font-weight:700}
  @media print{body{border:2px solid #000}}</style></head><body>
  <div class="top"><span class="logo">G SERVİS</span><span class="no">No: #${k.id} · ${k.tarih || ''}</span></div>
  <div class="cihaz">${getCihaz(k)}</div>
  <div class="row">
    <span class="badge">${k.cihazTuru || 'Cihaz'}</span>
    <span>${k.musteri || '—'}</span>
    <span>${k.telefon || ''}</span>
  </div>
  <div style="font-size:10px;color:#6b7280;border-top:1px dashed #e5e7eb;padding-top:3px">${k.ariza || '—'}</div>
  <script>window.onload=()=>{window.print()}</script></body></html>`
  const w = window.open('', '_blank', 'width=400,height=200')
  if (w) { w.document.write(html); w.document.close() }
}

function printFatura(k) {
  const kalan = (k.tutar || 0) - (k.odenen || 0)
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
  <title>Fatura #${k.id}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:13px;color:#1f2937;padding:40px;max-width:720px;margin:0 auto}
  .header{display:flex;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #f59e0b}
  .logo{font-size:22px;font-weight:900;color:#f59e0b}.subtitle{font-size:11px;color:#9ca3af;margin-top:3px}
  .fatura-no h1{font-size:18px;text-align:right}.fatura-no p{font-size:12px;color:#6b7280;text-align:right;margin-top:4px}
  .box{background:#f9fafb;border-radius:6px;padding:14px 16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .label{font-size:11px;color:#9ca3af}.val{font-weight:600}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  th{background:#1f2937;color:white;padding:8px 12px;text-align:left;font-size:12px}
  td{padding:8px 12px;border-bottom:1px solid #f3f4f6}
  .totals{margin-left:auto;width:240px}
  .trow{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
  .trow.grand{background:#f59e0b;color:white;font-weight:700;font-size:15px;padding:10px 12px;border-radius:6px;margin-top:6px;border:none}
  @media print{body{padding:20px}}</style></head><body>
  <div class="header">
    <div><div class="logo">G SERVİS TAKİP</div><div class="subtitle">Teknik Servis Yönetimi</div></div>
    <div class="fatura-no"><h1>SERVİS FATURASI</h1><p>No: <strong>#${k.id}</strong> · <strong>${k.tarih || '—'}</strong></p></div>
  </div>
  <div class="box">
    <div><div class="label">MÜŞTERİ</div><div class="val">${k.musteri || '—'}</div></div>
    <div><div class="label">TELEFON</div><div class="val">${k.telefon || '—'}</div></div>
    <div><div class="label">CİHAZ</div><div class="val">${getCihaz(k)}</div></div>
    <div><div class="label">DURUM</div><div class="val">${k.durum || '—'}</div></div>
    <div style="grid-column:span 2"><div class="label">ARIZA</div><div class="val">${k.ariza || '—'}</div></div>
  </div>
  <table><thead><tr><th>Açıklama</th><th style="text-align:right">Tutar</th></tr></thead>
  <tbody>
    <tr><td>Servis Ücreti — ${getCihaz(k)}</td><td style="text-align:right">₺${fmt(k.tutar)}</td></tr>
  </tbody></table>
  <div class="totals">
    <div class="trow"><span>Ara Toplam</span><span>₺${fmt(k.tutar)}</span></div>
    <div class="trow" style="color:#22c55e"><span>Ödenen</span><span>- ₺${fmt(k.odenen)}</span></div>
    <div class="trow grand"><span>KALAN</span><span>₺${fmt(kalan)}</span></div>
  </div>
  <div style="margin-top:32px;text-align:center;font-size:11px;color:#d1d5db;border-top:1px solid #f3f4f6;padding-top:12px">
    Hizmetimiz için teşekkür ederiz · G Servis Takip
  </div>
  <script>window.onload=()=>{window.print()}</script></body></html>`
  const w = window.open('', '_blank', 'width=860,height=1000')
  if (w) { w.document.write(html); w.document.close() }
}

/* ─── Sütun resize ───────────────────────────────────────── */
function useColResize(initialWidths) {
  const [widths, setWidths] = useState(initialWidths)
  const resizing = useRef(null)

  const startResize = useCallback((e, key) => {
    e.preventDefault()
    e.stopPropagation()
    resizing.current = { key, startX: e.clientX, startW: widths[key] }

    const onMove = (ev) => {
      if (!resizing.current) return
      const delta = ev.clientX - resizing.current.startX
      const newW = Math.max(MIN_W, resizing.current.startW + delta)
      setWidths(prev => ({ ...prev, [resizing.current.key]: newW }))
    }
    const onUp = () => {
      resizing.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [widths])

  return [widths, startResize]
}

/* ─── Cihaz Görseli ──────────────────────────────────────── */
const CIHAZ_EMOJI = {
  'Cep Telefonu': '📱', 'Laptop': '💻', 'Tablet': '📱',
  'Akıllı Saat': '⌚', 'Bilgisayar Kasası': '🖥️', 'Oyun Konsolu': '🎮',
  'Buzdolabı': '🧊', 'Çamaşır Makinesi': '🫧', 'Bulaşık Makinesi': '🫧',
  'Fırın/Ocak': '🔥', 'Klima': '❄️', 'TV/Monitör': '📺',
  'Elektrikli Alet': '🔌', 'Kulaklık': '🎧', 'Diğer': '🔧',
}

function GorselCell({ kayit }) {
  if (kayit.gorsel) {
    return <img src={kayit.gorsel} alt="" className="w-10 h-10 rounded-lg object-cover" />
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
      {CIHAZ_EMOJI[kayit.cihazTuru] || '🔧'}
    </div>
  )
}

/* ─── Durum Select ───────────────────────────────────────── */
function DurumSelect({ durum, onChange }) {
  const ds = DS[durum] || 'bg-gray-100 text-gray-700 border-gray-200'
  return (
    <select
      value={durum}
      onChange={e => onChange(e.target.value)}
      onClick={e => e.stopPropagation()}
      className={`text-xs font-semibold border rounded-lg px-2 py-1 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors ${ds}`}
      style={{ backgroundImage: 'none' }}
    >
      {DURUMLAR.map(d => <option key={d} value={d}>{d}</option>)}
    </select>
  )
}

/* ─── İşlem Butonları ────────────────────────────────────── */
function IconBtn({ title, onClick, children, danger }) {
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
        danger
          ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function IslemButonlari({ kayit, onDuzenle, onSil, onBaski, onWA }) {
  return (
    <div className="flex items-center gap-0.5">
      <IconBtn title="WhatsApp Mesaj Şablonları" onClick={() => onWA(kayit)}>
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </IconBtn>

      <IconBtn title="Düzenle" onClick={() => onDuzenle(kayit)}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </IconBtn>

      <IconBtn title="Yazdır (Fiş / Etiket / Fatura)" onClick={() => onBaski(kayit)}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </IconBtn>

      <IconBtn title="Sil" onClick={() => {
        if (window.confirm(`#${kayit.id} numaralı servis kaydı silinsin mi?`)) onSil(kayit.id)
      }} danger>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </IconBtn>
    </div>
  )
}

/* ─── Sütun Görünürlük Menüsü ────────────────────────────── */
function SutunMenu({ hidden, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const hideables = SUTUNLAR.filter(s => s.hide)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
          open
            ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Sütunlar
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 p-2 min-w-40">
          <p className="text-xs text-gray-400 px-2 py-1 font-medium uppercase tracking-wider">Göster / Gizle</p>
          {hideables.map(col => {
            const visible = !hidden.has(col.key)
            return (
              <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() => onChange(col.key)}
                  className="w-3.5 h-3.5 accent-amber-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{col.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Ana Bileşen ─────────────────────────────────────────── */
export default function ServisListesi({ kayitlar, onDurumChange, onDuzenle, onSil }) {
  const [filtre, setFiltre]     = useState('Tümü')
  const [arama, setArama]       = useState('')
  const [sortKey, setSortKey]   = useState('tarih')
  const [sortDir, setSortDir]   = useState('desc')
  const [hidden, setHidden]     = useState(new Set())
  const [baskiKayit, setBaskiKayit] = useState(null)
  const [waKayit,    setWaKayit]    = useState(null)

  const initialWidths = useMemo(() =>
    Object.fromEntries(SUTUNLAR.map(s => [s.key, s.w])), [])
  const [widths, startResize] = useColResize(initialWidths)

  /* Sayılar */
  const sayilar = useMemo(() => {
    const m = { 'Tümü': kayitlar.length }
    FILTRELER.slice(1).forEach(f => { m[f.key] = kayitlar.filter(k => k.durum === f.key).length })
    return m
  }, [kayitlar])

  /* Filtrelenmiş + sıralanmış */
  const data = useMemo(() => {
    let d = filtre === 'Tümü' ? [...kayitlar] : kayitlar.filter(k => k.durum === filtre)
    if (arama.trim()) {
      const q = arama.toLowerCase()
      d = d.filter(k =>
        k.musteri?.toLowerCase().includes(q) ||
        getCihaz(k).toLowerCase().includes(q) ||
        k.ariza?.toLowerCase().includes(q) ||
        k.telefon?.includes(q)
      )
    }
    d.sort((a, b) => {
      let av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
      if (sortKey === 'ucret') { av = a.tutar ?? 0; bv = b.tutar ?? 0 }
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'tr')
        : String(bv).localeCompare(String(av), 'tr')
    })
    return d
  }, [kayitlar, filtre, arama, sortKey, sortDir])

  const toggleSort = (key) => {
    if (!SUTUNLAR.find(s => s.key === key)?.sort) return
    setSortKey(prev => { if (prev === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return prev } setSortDir('asc'); return key })
  }

  const toggleHidden = (key) => {
    setHidden(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  const visibleCols = SUTUNLAR.filter(s => !hidden.has(s.key))

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* ── Filtre Butonları ── */}
      <div className="px-4 pt-4 pb-0 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {FILTRELER.map(f => {
            const count = sayilar[f.key] ?? 0
            const aktif = filtre === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFiltre(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  aktif
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  aktif ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="relative flex-1 max-w-72">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Servis içinde ara..."
            value={arama}
            onChange={e => setArama(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {arama && (
            <button onClick={() => setArama('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none">×</button>
          )}
        </div>

        <div className="text-xs text-gray-400 ml-auto">
          {data.length} kayıt {filtre !== 'Tümü' && `(${filtre})`}
        </div>

        <SutunMenu hidden={hidden} onChange={toggleHidden} />
      </div>

      {/* ── Tablo ── */}
      <div className="overflow-x-auto">
        <table className="text-sm" style={{ tableLayout: 'fixed', width: visibleCols.reduce((s, c) => s + widths[c.key], 0) + 'px', minWidth: '100%' }}>
          <colgroup>
            {visibleCols.map(col => <col key={col.key} style={{ width: widths[col.key] + 'px' }} />)}
          </colgroup>

          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              {visibleCols.map(col => {
                const isSorted = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    className="relative select-none"
                    style={{ width: widths[col.key] }}
                  >
                    <div
                      className={`flex items-center gap-1 px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${col.sort ? 'cursor-pointer hover:text-amber-600' : ''}`}
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      {col.sort && (
                        <span className={`ml-0.5 ${isSorted ? 'text-amber-500' : 'text-gray-300'}`}>
                          {isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      )}
                    </div>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center group z-10"
                      onMouseDown={e => startResize(e, col.key)}
                    >
                      <div className="w-0.5 h-4 bg-gray-200 dark:bg-gray-600 group-hover:bg-amber-400 rounded-full transition-colors" />
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length} className="text-center py-14 text-gray-400">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm">Kayıt bulunamadı</p>
                </td>
              </tr>
            ) : (
              data.map((k, i) => {
                const kalan = (k.tutar || 0) - (k.odened || k.odenen || 0)
                return (
                  <tr key={k.id} className={`border-b border-gray-50 dark:border-gray-700/50 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/30'}`}>

                    {!hidden.has('gorsel') && (
                      <td className="px-3 py-2"><GorselCell kayit={k} /></td>
                    )}

                    {!hidden.has('tarih') && (
                      <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{k.tarih || '—'}</td>
                    )}

                    <td className="px-3 py-2">
                      <p className="font-semibold text-gray-800 dark:text-white text-xs leading-tight">{k.musteri || '—'}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{k.telefon || ''}</p>
                    </td>

                    {!hidden.has('cihaz') && (
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-1">
                          {k.cihazTuru || 'Cihaz'}
                        </span>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{getCihaz(k)}</p>
                      </td>
                    )}

                    {!hidden.has('ariza') && (
                      <td className="px-3 py-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">{k.ariza || '—'}</p>
                        {k.pin && (
                          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">🔒 {k.pin}</p>
                        )}
                      </td>
                    )}

                    {!hidden.has('ucret') && (
                      <td className="px-3 py-2">
                        <p className="text-xs font-bold text-gray-800 dark:text-white">₺{fmt(k.tutar)}</p>
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {k.malzeme > 0 && <span className="text-[10px] text-purple-500">M:₺{fmt(k.malzeme, 0)}</span>}
                          {(k.odened || k.odenen) > 0 && <span className="text-[10px] text-green-500">Ö:₺{fmt(k.odened || k.odenen, 0)}</span>}
                          {kalan !== k.tutar && <span className="text-[10px] text-red-400">K:₺{fmt(kalan, 0)}</span>}
                        </div>
                      </td>
                    )}

                    <td className="px-3 py-2">
                      <DurumSelect
                        durum={k.durum}
                        onChange={newDurum => onDurumChange(k.id, newDurum)}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <IslemButonlari
                        kayit={k}
                        onDuzenle={onDuzenle}
                        onSil={onSil}
                        onBaski={setBaskiKayit}
                        onWA={setWaKayit}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400">
        <span>Toplam: <strong className="text-gray-600 dark:text-gray-300">{data.length}</strong> kayıt</span>
        {arama && <span>"{arama}" araması</span>}
        {filtre !== 'Tümü' && (
          <button onClick={() => setFiltre('Tümü')} className="text-amber-500 hover:text-amber-700 cursor-pointer">
            Filtreyi temizle
          </button>
        )}
      </div>
    </div>

    {baskiKayit && (
      <BaskiModal kayit={baskiKayit} onClose={() => setBaskiKayit(null)} />
    )}
    {waKayit && (
      <WhatsAppModal kayit={waKayit} onClose={() => setWaKayit(null)} />
    )}
    </>
  )
}
