import { useState, useRef, useEffect, useCallback } from 'react'
import { cariler } from '../../data/mock'

/* ─── Sabitler ───────────────────────────────────────────── */
const CIHAZ_TURLERI = [
  'Cep Telefonu', 'Laptop', 'Tablet', 'Akıllı Saat',
  'Bilgisayar Kasası', 'Oyun Konsolu', 'Buzdolabı', 'Çamaşır Makinesi',
  'Bulaşık Makinesi', 'Fırın/Ocak', 'Klima', 'TV/Monitör', 'Elektrikli Alet', 'Diğer',
]

const DURUMLAR = [
  { label: 'Randevu',      color: 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700' },
  { label: 'Beklemede',    color: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700' },
  { label: 'Tamirde',      color: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700' },
  { label: 'Hazır',        color: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
  { label: 'Teslim Edildi',color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' },
  { label: 'İade',         color: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
]

const AKSESUARLAR = ['Şarj Aleti', 'Kulaklık', 'Kılıf', 'Koruyucu Cam', 'Kutu', 'Diğer']

const KDV = [
  { label: 'KDV Yok', oran: 0 },
  { label: '%10', oran: 0.10 },
  { label: '%20', oran: 0.20 },
]

const INITIAL = {
  cihazTuru: '',
  adSoyad: '', telefon: '',
  marka: '', model: '', imei: '', renk: '', hafiza: '', pilSagligi: '',
  gorsel: null, gorselUrl: null,
  arizaAciklama: '', sifre: '', aksesuarlar: [],
  malzemeMaliyetiGoster: false,
  servisUcreti: '', malzemeMaliyeti: '', onOdeme: '', kdvOran: 0,
  durum: 'Beklemede',
}

/* ─── Yardımcı bileşenler ────────────────────────────────── */
const inputCls = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm
  bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
  disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 transition`

function Field({ label, required, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">{title}</span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>
      {children}
    </div>
  )
}

function formatPhone(val) {
  const d = val.replace(/\D/g, '').slice(0, 11)
  let out = d.slice(0, 4)
  if (d.length > 4) out += ' ' + d.slice(4, 7)
  if (d.length > 7) out += ' ' + d.slice(7, 9)
  if (d.length > 9) out += ' ' + d.slice(9, 11)
  return out
}

function para(v) { return parseFloat(v) || 0 }

/* ─── Ana bileşen ─────────────────────────────────────────── */
export default function ServisForm({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL)
  const [musteriOneri, setMusteriOneri] = useState([])
  const [oneriAcik, setOneriAcik] = useState(false)
  const fileRef = useRef(null)
  const drawerRef = useRef(null)

  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), [])

  /* ESC ile kapat */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  /* Müşteri önerileri */
  const handleAdSoyad = (val) => {
    set('adSoyad', val)
    if (val.trim().length >= 2) {
      const matches = cariler.filter(c =>
        c.ad.toLowerCase().includes(val.toLowerCase())
      )
      setMusteriOneri(matches)
      setOneriAcik(matches.length > 0)
    } else {
      setOneriAcik(false)
    }
  }

  const secMusteri = (c) => {
    setForm(f => ({ ...f, adSoyad: c.ad, telefon: formatPhone(c.telefon) }))
    setOneriAcik(false)
  }

  /* Telefon formatı */
  const handleTelefon = (val) => set('telefon', formatPhone(val))

  /* Görsel yükleme */
  const handleGorsel = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(f => ({ ...f, gorsel: file, gorselUrl: url }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleGorsel(e.dataTransfer.files[0])
  }

  /* Aksesuar toggle */
  const toggleAksesuar = (ak) => {
    setForm(f => ({
      ...f,
      aksesuarlar: f.aksesuarlar.includes(ak)
        ? f.aksesuarlar.filter(a => a !== ak)
        : [...f.aksesuarlar, ak],
    }))
  }

  /* Fiyat hesaplama */
  const araToplam = para(form.servisUcreti) + (form.malzemeMaliyetiGoster ? para(form.malzemeMaliyeti) : 0)
  const kdvTutar = araToplam * form.kdvOran
  const toplam = araToplam + kdvTutar
  const kalan = toplam - para(form.onOdeme)

  /* Kaydet */
  const handleSave = () => {
    if (!form.cihazTuru) return alert('Lütfen cihaz türünü seçin.')
    if (!form.adSoyad.trim()) return alert('Lütfen müşteri adını girin.')
    onSave?.({ ...form, id: Date.now() })
    setForm(INITIAL)
    onClose()
  }

  /* Reset on close */
  const handleClose = () => {
    setForm(INITIAL)
    setOneriAcik(false)
    onClose()
  }

  const disabled = !form.cihazTuru

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Drawer paneli */}
      <div
        ref={drawerRef}
        className={`relative flex flex-col bg-white dark:bg-gray-900 w-full max-w-2xl h-full shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-base">Yeni Servis Kaydı</h2>
              <p className="text-xs text-gray-400">Tüm alanları doldurun</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 cursor-pointer transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        {/* Scrollable içerik */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── 1. CİHAZ TÜRÜ ─────────────────────────────── */}
          <Section icon="📱" title="Cihaz Türü">
            <Field label="Cihaz Türü" required>
              <select
                value={form.cihazTuru}
                onChange={e => set('cihazTuru', e.target.value)}
                className={inputCls}
              >
                <option value="">— Seçin —</option>
                {CIHAZ_TURLERI.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            {!form.cihazTuru && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>⚠️</span> Devam etmek için önce cihaz türünü seçin.
              </p>
            )}
          </Section>

          {/* ── 2. MÜŞTERİ BİLGİLERİ ─────────────────────── */}
          <Section icon="👤" title="Müşteri Bilgileri">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ad Soyad" required className="relative">
                <input
                  type="text"
                  placeholder="Müşteri adı..."
                  value={form.adSoyad}
                  onChange={e => handleAdSoyad(e.target.value)}
                  onBlur={() => setTimeout(() => setOneriAcik(false), 150)}
                  disabled={disabled}
                  className={inputCls}
                  autoComplete="off"
                />
                {/* Öneri listesi */}
                {oneriAcik && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                    {musteriOneri.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={() => secMusteri(c)}
                        className="w-full text-left px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{c.ad}</p>
                          <p className="text-xs text-gray-400">{c.telefon}</p>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-0.5 rounded-full">Mevcut</span>
                      </button>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Telefon">
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={form.telefon}
                  onChange={e => handleTelefon(e.target.value)}
                  disabled={disabled}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          {/* ── 3. CİHAZ BİLGİLERİ ───────────────────────── */}
          <Section icon="🔧" title="Cihaz Bilgileri">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Marka">
                <input type="text" placeholder="Apple, Samsung..." disabled={disabled} value={form.marka} onChange={e => set('marka', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Model">
                <input type="text" placeholder="iPhone 14, Galaxy S23..." disabled={disabled} value={form.model} onChange={e => set('model', e.target.value)} className={inputCls} />
              </Field>
              <Field label="IMEI / Seri No">
                <input type="text" placeholder="15 haneli IMEI..." disabled={disabled} value={form.imei} onChange={e => set('imei', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Renk">
                <input type="text" placeholder="Siyah, Beyaz..." disabled={disabled} value={form.renk} onChange={e => set('renk', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Hafıza / Kapasite">
                <input type="text" placeholder="128 GB, 1 TB..." disabled={disabled} value={form.hafiza} onChange={e => set('hafiza', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Pil Sağlığı (%)">
                <div className="relative">
                  <input
                    type="number" min="0" max="100"
                    placeholder="85"
                    disabled={disabled}
                    value={form.pilSagligi}
                    onChange={e => set('pilSagligi', Math.min(100, Math.max(0, e.target.value)))}
                    className={inputCls + ' pr-8'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                {form.pilSagligi && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${form.pilSagligi >= 80 ? 'bg-green-500' : form.pilSagligi >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${form.pilSagligi}%` }}
                    />
                  </div>
                )}
              </Field>
            </div>

            {/* Görsel yükleme */}
            <Field label="Cihaz Görseli">
              <div
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${disabled ? 'border-gray-100 dark:border-gray-800 opacity-50 pointer-events-none' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600'}`}
                onClick={() => !disabled && fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {form.gorselUrl ? (
                  <div className="relative">
                    <img src={form.gorselUrl} alt="Cihaz görseli" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, gorsel: null, gorselUrl: null })) }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="py-3">
                    <svg className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">Sürükle & bırak veya <span className="text-amber-500 font-medium">dosya seç</span></p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">PNG, JPG, HEIC — max 10 MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleGorsel(e.target.files[0])} />
              </div>
            </Field>
          </Section>

          {/* ── 4. ARIZA BİLGİSİ ─────────────────────────── */}
          <Section icon="⚡" title="Arıza Bilgisi">
            <Field label="Arıza Açıklaması">
              <textarea
                rows={3}
                placeholder="Müşterinin tarif ettiği arıza detayları..."
                disabled={disabled}
                value={form.arizaAciklama}
                onChange={e => set('arizaAciklama', e.target.value)}
                className={inputCls + ' resize-none'}
              />
            </Field>

            <Field label="Müşteri Şifresi / PIN">
              <input
                type="text"
                placeholder="Ör: 1234 veya desen şifresi..."
                disabled={disabled}
                value={form.sifre}
                onChange={e => set('sifre', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Teslim Alınan Aksesuarlar">
              <div className="flex flex-wrap gap-2">
                {AKSESUARLAR.map(ak => {
                  const secili = form.aksesuarlar.includes(ak)
                  return (
                    <button
                      key={ak}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleAksesuar(ak)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 ${
                        secili
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'
                      }`}
                    >
                      {secili && '✓ '}{ak}
                    </button>
                  )
                })}
              </div>
            </Field>
          </Section>

          {/* ── 5. FİYAT & ÖDEME ─────────────────────────── */}
          <Section icon="💰" title="Fiyat & Ödeme">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Servis Ücreti (₺)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₺</span>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder="0.00"
                    disabled={disabled}
                    value={form.servisUcreti}
                    onChange={e => set('servisUcreti', e.target.value)}
                    className={inputCls + ' pl-7'}
                  />
                </div>
              </Field>

              <Field label="Ön Ödeme (₺)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₺</span>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder="0.00"
                    disabled={disabled}
                    value={form.onOdeme}
                    onChange={e => set('onOdeme', e.target.value)}
                    className={inputCls + ' pl-7'}
                  />
                </div>
              </Field>
            </div>

            {/* Malzeme maliyeti toggle */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Malzeme maliyeti ekle (iç kullanım)</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => set('malzemeMaliyetiGoster', !form.malzemeMaliyetiGoster)}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer disabled:opacity-40 ${form.malzemeMaliyetiGoster ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.malzemeMaliyetiGoster ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {form.malzemeMaliyetiGoster && (
              <Field label="Malzeme Maliyeti (₺) — Gizli">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₺</span>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder="0.00"
                    value={form.malzemeMaliyeti}
                    onChange={e => set('malzemeMaliyeti', e.target.value)}
                    className={inputCls + ' pl-7'}
                  />
                </div>
              </Field>
            )}

            {/* KDV seçimi */}
            <Field label="KDV">
              <div className="flex gap-2">
                {KDV.map(k => (
                  <button
                    key={k.oran}
                    type="button"
                    disabled={disabled}
                    onClick={() => set('kdvOran', k.oran)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer disabled:opacity-40 ${
                      form.kdvOran === k.oran
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Özet */}
            {(form.servisUcreti || form.malzemeMaliyeti) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ara toplam</span>
                  <span>₺{araToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                {form.kdvOran > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>KDV (%{form.kdvOran * 100})</span>
                    <span>₺{kdvTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {form.onOdeme && (
                  <div className="flex justify-between text-green-600">
                    <span>Ön ödeme</span>
                    <span>- ₺{para(form.onOdeme).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-1.5 mt-1">
                  <span>Kalan Ödeme</span>
                  <span className={kalan > 0 ? 'text-red-500' : 'text-green-500'}>
                    ₺{kalan.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* ── 6. DURUM ─────────────────────────────────── */}
          <Section icon="🏷️" title="Servis Durumu">
            <div className="grid grid-cols-3 gap-2">
              {DURUMLAR.map(d => (
                <button
                  key={d.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => set('durum', d.label)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-all disabled:opacity-40 ${
                    form.durum === d.label
                      ? d.color + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {form.durum === d.label && '● '}{d.label}
                </button>
              ))}
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!form.cihazTuru || !form.adSoyad.trim()}
            className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold text-sm cursor-pointer disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {!form.cihazTuru ? 'Önce cihaz türü seçin' : !form.adSoyad.trim() ? 'Müşteri adı gerekli' : '✓ Kaydı Oluştur'}
          </button>
        </div>
      </div>
    </div>
  )
}
