import { useState, useMemo, useCallback } from 'react'

/* ─── Sabitler ───────────────────────────────────────────── */
const DOLAR_KURU = 45.96

const KDV_SECIMLER = [
  { label: '%0',   oran: 0 },
  { label: '%10',  oran: 0.10 },
  { label: '%20',  oran: 0.20 },
  { label: 'Özel', oran: null },
]

const newRow = () => ({
  id: Date.now() + Math.random(),
  ad: '', adet: 1, satisFiyati: '', alisFiyati: '',
})

const newForm = () => ({
  adSoyad: '', telefon: '',
  teklifNo: `TKL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
  tarih: new Date().toLocaleDateString('tr-TR'),
  isTuru: '',
  malzemeler: [newRow()],
  alisFiyatiGoster: false,
  musteriMalzeme: false,
  iscilik: '',
  kdvSecim: '%20', kdvOzelOran: '',
  kdvDahil: false,
  not: '',
})

const p = (v) => parseFloat(v) || 0
const fmt = (v, d = 2) => v.toLocaleString('tr-TR', { minimumFractionDigits: d })

/* ─── Yazdırma HTML'i ────────────────────────────────────── */
function buildPrintHTML({ form, kdvOran, netMalzeme, iscilik, araToplam, kdvTutar, genelToplam }) {
  const satirlar = form.malzemeler
    .filter(r => r.ad.trim())
    .map(r => {
      const adet = p(r.adet), fiyat = p(r.satisFiyati)
      return `<tr>
        <td>${r.ad}</td>
        <td style="text-align:center">${adet}</td>
        <td style="text-align:right">₺${fmt(fiyat)}</td>
        <td style="text-align:right"><strong>₺${fmt(adet * fiyat)}</strong></td>
      </tr>`
    }).join('') || `<tr><td colspan="4" style="text-align:center;color:#9ca3af;padding:16px">Malzeme eklenmedi</td></tr>`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Fiyat Teklifi – ${form.teklifNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:13px;color:#1f2937;padding:40px;max-width:800px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #f59e0b}
  .logo{font-size:22px;font-weight:900;color:#f59e0b;letter-spacing:-0.5px}
  .logo-sub{font-size:11px;color:#9ca3af;margin-top:3px}
  .teklif-baslik h1{font-size:20px;color:#1f2937;text-align:right}
  .teklif-baslik p{font-size:12px;color:#6b7280;text-align:right;margin-top:4px}
  .musteri-box{background:#f9fafb;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:6px 20px}
  .musteri-box .field{font-size:12px}.musteri-box .label{color:#9ca3af;font-size:11px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  thead tr{background:#1f2937;color:white}
  th{padding:10px 12px;text-align:left;font-size:12px;font-weight:600}
  td{padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:13px}
  tr:nth-child(even) td{background:#f9fafb}
  .musteri-malzeme{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:#92400e}
  .totals{margin-left:auto;width:280px}
  .total-row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;border-bottom:1px solid #f3f4f6}
  .total-row.highlight{color:#d97706;font-weight:600}
  .total-row.grand{background:#f59e0b;color:white;font-weight:700;font-size:15px;padding:10px 12px;border-radius:8px;margin-top:6px;border:none}
  .not{margin-top:20px;padding:12px 14px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;font-size:12px;color:#78350f}
  .footer{margin-top:36px;text-align:center;font-size:11px;color:#d1d5db;border-top:1px solid #f3f4f6;padding-top:16px}
  @media print{body{padding:20px}}
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">G Servis Takip</div>
      <div class="logo-sub">Teknik Servis Yönetimi</div>
    </div>
    <div class="teklif-baslik">
      <h1>FİYAT TEKLİFİ</h1>
      <p>No: <strong>${form.teklifNo}</strong> &nbsp;·&nbsp; Tarih: <strong>${form.tarih}</strong></p>
    </div>
  </div>

  <div class="musteri-box">
    <div><div class="label">MÜŞTERİ</div><div class="field"><strong>${form.adSoyad || '—'}</strong></div></div>
    <div><div class="label">TELEFON</div><div class="field">${form.telefon || '—'}</div></div>
    ${form.isTuru ? `<div style="grid-column:span 2"><div class="label">İŞ TÜRÜ</div><div class="field">${form.isTuru}</div></div>` : ''}
  </div>

  ${form.musteriMalzeme
    ? `<div class="musteri-malzeme">ℹ️ Malzemeleri müşteri temin edecektir — bu teklif yalnızca işçilik içermektedir.</div>`
    : `<table>
        <thead><tr><th>Malzeme Adı</th><th style="text-align:center">Adet</th><th style="text-align:right">Birim Fiyat</th><th style="text-align:right">Toplam</th></tr></thead>
        <tbody>${satirlar}</tbody>
      </table>`
  }

  <div class="totals">
    ${!form.musteriMalzeme ? `<div class="total-row"><span>Malzeme Toplamı</span><span>₺${fmt(netMalzeme)}</span></div>` : ''}
    ${iscilik ? `<div class="total-row"><span>İşçilik</span><span>₺${fmt(iscilik)}</span></div>` : ''}
    <div class="total-row highlight"><span>Ara Toplam</span><span>₺${fmt(araToplam)}</span></div>
    ${kdvOran > 0 ? `<div class="total-row"><span>KDV (%${(kdvOran * 100).toFixed(0)}) ${form.kdvDahil ? '(dahil)' : ''}</span><span>₺${fmt(kdvTutar)}</span></div>` : ''}
    <div class="total-row grand"><span>GENEL TOPLAM</span><span>₺${fmt(genelToplam)}</span></div>
  </div>

  ${form.not ? `<div class="not"><strong>Not:</strong> ${form.not}</div>` : ''}

  <div class="footer">
    Bu teklif ${form.tarih} tarihinde düzenlenmiştir. · G Servis Takip
  </div>
</body>
</html>`
}

/* ─── Shared input stili ─────────────────────────────────── */
const inputCls = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm
  bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition`

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Section({ icon, title, children, right }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">{title}</span>
          <div className="w-16 h-px bg-gray-100 dark:bg-gray-800" />
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <div className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      {label && <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>}
    </button>
  )
}

/* ─── Ana Bileşen ─────────────────────────────────────────── */
export default function TeklifForm({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(newForm)
  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), [])

  /* Satır işlemleri */
  const addRow    = () => setForm(f => ({ ...f, malzemeler: [...f.malzemeler, newRow()] }))
  const removeRow = (id) => setForm(f => ({ ...f, malzemeler: f.malzemeler.filter(r => r.id !== id) }))
  const updateRow = (id, field, val) =>
    setForm(f => ({ ...f, malzemeler: f.malzemeler.map(r => r.id === id ? { ...r, [field]: val } : r) }))

  /* Hesaplamalar */
  const kdvOran = useMemo(() => {
    const found = KDV_SECIMLER.find(k => k.label === form.kdvSecim)
    return found?.oran ?? (p(form.kdvOzelOran) / 100)
  }, [form.kdvSecim, form.kdvOzelOran])

  const malzemeSatisTop = useMemo(() =>
    form.malzemeler.reduce((s, r) => s + p(r.adet) * p(r.satisFiyati), 0),
    [form.malzemeler])

  const malzemeAlisTop = useMemo(() =>
    form.malzemeler.reduce((s, r) => s + p(r.adet) * p(r.alisFiyati), 0),
    [form.malzemeler])

  const iscilik    = p(form.iscilik)
  const netMalzeme = form.musteriMalzeme ? 0 : malzemeSatisTop
  const araToplam  = netMalzeme + iscilik
  const kar        = malzemeSatisTop - malzemeAlisTop

  const { kdvTutar, genelToplam, kdvHaricToplam } = useMemo(() => {
    if (form.kdvDahil) {
      const kdt = araToplam * kdvOran / (1 + kdvOran)
      return { kdvTutar: kdt, genelToplam: araToplam, kdvHaricToplam: araToplam - kdt }
    }
    const kdt = araToplam * kdvOran
    return { kdvTutar: kdt, genelToplam: araToplam + kdt, kdvHaricToplam: araToplam }
  }, [araToplam, kdvOran, form.kdvDahil])

  /* Yazdır */
  const handlePrint = () => {
    const html = buildPrintHTML({ form, kdvOran, netMalzeme, iscilik, araToplam, kdvTutar, genelToplam })
    const win = window.open('', '_blank', 'width=860,height=1100')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }

  /* WhatsApp */
  const handleWhatsApp = () => {
    const malzemeListesi = form.malzemeler
      .filter(r => r.ad.trim())
      .map(r => `• ${r.ad}: ${p(r.adet)} × ₺${fmt(p(r.satisFiyati))} = ₺${fmt(p(r.adet) * p(r.satisFiyati))}`)
      .join('\n')

    const satırlar = [
      `*📋 FİYAT TEKLİFİ — ${form.teklifNo}*`,
      `📅 ${form.tarih}`,
      ``,
      `*Sayın:* ${form.adSoyad || '—'}`,
      form.telefon ? `*Tel:* ${form.telefon}` : null,
      form.isTuru  ? `*İş:* ${form.isTuru}` : null,
      ``,
      !form.musteriMalzeme && malzemeListesi
        ? `*📦 Malzemeler:*\n${malzemeListesi}`
        : `📦 _Malzemeleri müşteri temin edecektir._`,
      iscilik       ? `*⚙️ İşçilik:* ₺${fmt(iscilik)}` : null,
      kdvOran > 0   ? `*🏷️ KDV (%${(kdvOran * 100).toFixed(0)}):* ₺${fmt(kdvTutar)}` : null,
      ``,
      `*✅ GENEL TOPLAM: ₺${fmt(genelToplam)}*`,
      form.not ? `\n📝 _${form.not}_` : null,
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/?text=${encodeURIComponent(satırlar)}`, '_blank', 'noopener')
  }

  /* Kaydet & Kapat */
  const handleSave = () => {
    onSave?.({ ...form, genelToplam, kdvTutar, createdAt: new Date().toISOString() })
    setForm(newForm())
    onClose()
  }
  const handleClose = () => { setForm(newForm()); onClose() }

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`relative flex flex-col bg-white dark:bg-gray-900 w-full max-w-3xl h-full shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* ── Başlık ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white text-base">📄</div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-base">Fiyat Teklifi Oluştur</h2>
              <p className="text-xs text-gray-400">No: <strong>{form.teklifNo}</strong> · {form.tarih}</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-2xl leading-none">&times;</button>
        </div>

        {/* ── Scrollable içerik ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* 1. Müşteri Bilgileri */}
          <Section icon="👤" title="Müşteri Bilgileri">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ad Soyad">
                <input type="text" placeholder="Ad Soyad" value={form.adSoyad} onChange={e => set('adSoyad', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Telefon">
                <input type="tel" placeholder="05XX XXX XX XX" value={form.telefon} onChange={e => set('telefon', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* 2. İş Türü */}
          <Section icon="🔧" title="İş Türü Açıklaması">
            <textarea
              rows={2}
              placeholder="Yapılacak işin kısa açıklaması..."
              value={form.isTuru}
              onChange={e => set('isTuru', e.target.value)}
              className={inputCls + ' resize-none'}
            />
          </Section>

          {/* 3. Malzeme Listesi */}
          <Section
            icon="📦"
            title="Malzeme Listesi"
            right={
              <div className="flex items-center gap-3">
                <Toggle
                  checked={form.alisFiyatiGoster}
                  onChange={v => set('alisFiyatiGoster', v)}
                  label="Alış fiyatını göster"
                />
              </div>
            }
          >
            {/* Müşteri malzeme checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2.5 border border-amber-100 dark:border-amber-800">
              <input
                type="checkbox"
                checked={form.musteriMalzeme}
                onChange={e => set('musteriMalzeme', e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Müşteri malzemeyi kendi alıyor</span>
                <p className="text-xs text-amber-600 dark:text-amber-500">Malzeme tutarı teklife dahil edilmez, yalnızca işçilik hesaplanır.</p>
              </div>
            </label>

            {/* Tablo */}
            <div className={`overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 ${form.musteriMalzeme ? 'opacity-50 pointer-events-none' : ''}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Malzeme Adı</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 w-20 text-center">Adet</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 w-28 text-right">Satış Fiyatı</th>
                    {form.alisFiyatiGoster && (
                      <th className="px-3 py-2.5 text-xs font-semibold text-orange-400 w-28 text-right">Alış Fiyatı</th>
                    )}
                    <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 w-28 text-right">Toplam</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {form.malzemeler.map((row, i) => {
                    const satirToplam = p(row.adet) * p(row.satisFiyati)
                    return (
                      <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            placeholder="Malzeme adı..."
                            value={row.ad}
                            onChange={e => updateRow(row.id, 'ad', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-amber-400 outline-none text-sm text-gray-700 dark:text-gray-300 py-0.5 transition-colors"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number" min="1"
                            value={row.adet}
                            onChange={e => updateRow(row.id, 'adet', e.target.value)}
                            className="w-16 text-center bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-amber-400 outline-none text-sm text-gray-700 dark:text-gray-300 py-0.5 transition-colors"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="relative">
                            <span className="absolute left-0 top-0.5 text-gray-400 text-xs">₺</span>
                            <input
                              type="number" min="0" step="0.01"
                              placeholder="0,00"
                              value={row.satisFiyati}
                              onChange={e => updateRow(row.id, 'satisFiyati', e.target.value)}
                              className="w-full pl-4 text-right bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-amber-400 outline-none text-sm text-gray-700 dark:text-gray-300 py-0.5 transition-colors"
                            />
                          </div>
                        </td>
                        {form.alisFiyatiGoster && (
                          <td className="px-2 py-1.5">
                            <div className="relative">
                              <span className="absolute left-0 top-0.5 text-orange-300 text-xs">₺</span>
                              <input
                                type="number" min="0" step="0.01"
                                placeholder="0,00"
                                value={row.alisFiyati}
                                onChange={e => updateRow(row.id, 'alisFiyati', e.target.value)}
                                className="w-full pl-4 text-right bg-transparent border-b border-transparent hover:border-orange-200 focus:border-orange-400 outline-none text-sm text-orange-500 py-0.5 transition-colors"
                              />
                            </div>
                          </td>
                        )}
                        <td className="px-2 py-1.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {satirToplam > 0 ? `₺${fmt(satirToplam)}` : '—'}
                        </td>
                        <td className="px-1 py-1.5 text-center">
                          {form.malzemeler.length > 1 && (
                            <button
                              onClick={() => removeRow(row.id)}
                              className="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors text-lg leading-none"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-100 dark:border-gray-700">
                    <td colSpan={form.alisFiyatiGoster ? 2 : 2} className="px-3 py-2">
                      <button
                        onClick={addRow}
                        className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-700 font-medium cursor-pointer transition-colors"
                      >
                        <span className="text-base leading-none">+</span> Satır Ekle
                      </button>
                    </td>
                    {form.alisFiyatiGoster && (
                      <td colSpan={1} className="px-3 py-2 text-right text-xs text-orange-400">
                        Alış: ₺{fmt(malzemeAlisTop)}
                      </td>
                    )}
                    <td className="px-3 py-2 text-right text-sm font-bold text-gray-800 dark:text-white" colSpan={form.alisFiyatiGoster ? 2 : 2}>
                      ₺{fmt(malzemeSatisTop)}
                    </td>
                    <td />
                  </tr>
                  {form.alisFiyatiGoster && malzemeSatisTop > 0 && (
                    <tr className="bg-orange-50 dark:bg-orange-900/10">
                      <td colSpan={5 + (form.alisFiyatiGoster ? 1 : 0)} className="px-3 py-1.5 text-xs text-orange-600 dark:text-orange-400">
                        💰 Tahmini Kâr: ₺{fmt(kar)} · Kâr Marjı: %{malzemeSatisTop > 0 ? ((kar / malzemeSatisTop) * 100).toFixed(1) : 0}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </Section>

          {/* 4. Dolar Kuru */}
          <Section icon="💵" title="Dolar Kuru">
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl px-4 py-3">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">$1</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-2xl font-black text-gray-800 dark:text-white">₺{DOLAR_KURU.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Gösterge kur · Güncel kur için bankayı kontrol edin</p>
              </div>
              {genelToplam > 0 && (
                <div className="text-right border-l border-emerald-200 dark:border-emerald-700 pl-4">
                  <p className="text-xs text-gray-400">Toplam (USD)</p>
                  <p className="text-lg font-bold text-emerald-600">${(genelToplam / DOLAR_KURU).toFixed(2)}</p>
                </div>
              )}
            </div>
          </Section>

          {/* 5. İşçilik */}
          <Section icon="⚙️" title="İşçilik Ücreti">
            <Field label="İşçilik (₺)">
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₺</span>
                <input
                  type="number" min="0" step="0.01"
                  placeholder="0,00"
                  value={form.iscilik}
                  onChange={e => set('iscilik', e.target.value)}
                  className={inputCls + ' pl-7'}
                />
              </div>
            </Field>
          </Section>

          {/* 6. KDV */}
          <Section
            icon="🏷️"
            title="KDV Ayarları"
            right={
              <Toggle
                checked={form.kdvDahil}
                onChange={v => set('kdvDahil', v)}
                label={form.kdvDahil ? 'KDV Dahil' : 'KDV Hariç'}
              />
            }
          >
            <div className="flex gap-2 flex-wrap">
              {KDV_SECIMLER.map(k => (
                <button
                  key={k.label}
                  onClick={() => set('kdvSecim', k.label)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                    form.kdvSecim === k.label
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'
                  }`}
                >
                  {k.label}
                </button>
              ))}
              {form.kdvSecim === 'Özel' && (
                <div className="relative">
                  <input
                    type="number" min="0" max="100"
                    placeholder="Oran"
                    value={form.kdvOzelOran}
                    onChange={e => set('kdvOzelOran', e.target.value)}
                    className={`${inputCls} w-28 pr-7`}
                    autoFocus
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {form.kdvDahil
                ? 'Girilen fiyatlar KDV dahildir. KDV tutarı içeriden hesaplanır.'
                : 'Girilen fiyatlar KDV hariçtir. KDV tutarı üstüne eklenir.'}
            </p>
          </Section>

          {/* 7. Toplam Özet */}
          <Section icon="📊" title="Genel Toplam">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {[
                !form.musteriMalzeme && { label: 'Malzeme Toplamı', val: netMalzeme },
                iscilik && { label: 'İşçilik', val: iscilik },
                { label: form.kdvDahil ? 'Ara Toplam (KDV dahil)' : 'Ara Toplam (KDV hariç)', val: araToplam, bold: true },
                kdvOran > 0 && {
                  label: `KDV %${(kdvOran * 100).toFixed(0)} ${form.kdvDahil ? '(dahil hesaplanmış)' : ''}`,
                  val: kdvTutar, accent: true,
                },
              ].filter(Boolean).map((row, i) => (
                <div key={i} className={`flex justify-between px-4 py-2.5 text-sm border-b border-gray-100 dark:border-gray-800 ${row.bold ? 'font-semibold text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'} ${row.accent ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                  <span>{row.label}</span>
                  <span>₺{fmt(row.val)}</span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3.5 bg-amber-500 text-white font-bold text-base">
                <span>GENEL TOPLAM</span>
                <span>₺{fmt(genelToplam)}</span>
              </div>
            </div>
          </Section>

          {/* 8. Not */}
          <Section icon="📝" title="Not">
            <textarea
              rows={3}
              placeholder="Teklifle ilgili notlar, geçerlilik süresi, ödeme koşulları..."
              value={form.not}
              onChange={e => set('not', e.target.value)}
              className={inputCls + ' resize-none'}
            />
          </Section>
        </div>

        {/* ── Footer / Butonlar ── */}
        <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-6 py-3 flex items-center gap-2">
            {/* Yazdır */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Yazdır
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp'a Gönder
            </button>

            <div className="flex-1" />

            {/* İptal */}
            <button
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              İptal
            </button>

            {/* Kaydet */}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer transition-colors shadow-sm"
            >
              ✓ Teklifi Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
