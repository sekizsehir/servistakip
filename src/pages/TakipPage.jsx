import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'

/* ─── Firma ──────────────────────────────────────────────── */
const FIRMA = {
  ad:  'G Servis Takip',
  sub: 'Teknik Servis Merkezi',
  tel: '0212 XXX XX XX',
  web: 'servis.genixsoft.com.tr',
  waNo:'902120000000',
}

/* ─── Adımlar ────────────────────────────────────────────── */
const ADIMLAR = [
  { key: 'Randevu',      label: 'Teslim Alındı',  icon: '📥', kisa: 'Teslim' },
  { key: 'Beklemede',    label: 'Beklemede',       icon: '⏳', kisa: 'Bekliyor' },
  { key: 'Tamirde',      label: 'Tamirde',         icon: '🔧', kisa: 'Tamir' },
  { key: 'Hazır',        label: 'Hazır',           icon: '✅', kisa: 'Hazır' },
  { key: 'Teslim Edildi',label: 'Teslim Edildi',   icon: '📦', kisa: 'Teslim' },
]

const adimIndex = (durum) => {
  if (durum === 'İade') return -1
  return ADIMLAR.findIndex(a => a.key === durum)
}

const tarihTR = (d) =>
  d ? new Date(d + 'T00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : null

/* ─── Cihaz Emoji ────────────────────────────────────────── */
const CIHAZ_EMOJI = {
  'Cep Telefonu': '📱', 'Laptop': '💻', 'Tablet': '📱',
  'Akıllı Saat': '⌚', 'Kulaklık': '🎧', 'Oyun Konsolu': '🎮',
  'TV/Monitör': '📺', 'Diğer': '🔧',
}

/* ─── DB (İng.) → UI (Türkçe) normalize ─────────────────── */
function normalize(s) {
  return {
    id:            s.id,
    musteri:       s.musteri       ?? s.name           ?? '—',
    telefon:       s.telefon       ?? s.phone          ?? '—',
    cihazTuru:     s.cihazTuru     ?? s.deviceType     ?? '—',
    marka:         s.marka         ?? s.brand          ?? '',
    model:         s.model         ?? '',
    ariza:         s.ariza         ?? s.fault          ?? '—',
    pin:           s.pin           ?? null,
    durum:         s.durum         ?? s.status         ?? 'Beklemede',
    tarih:         s.tarih         ?? (s.createdAt ? s.createdAt.split('T')[0] : null),
    tahminiTarih:  s.tahminiTarih  ?? s.estimatedDate  ?? null,
    teknisyen:     s.teknisyen     ?? s.technician     ?? '—',
    teknisyenNotu: s.teknisyenNotu ?? s.technicianNote ?? null,
    tutar:         s.tutar         ?? s.price          ?? 0,
    malzeme:       s.malzeme       ?? s.materialCost   ?? 0,
    odenen:        s.odenen        ?? s.prepaid        ?? 0,
    gorsel:        s.gorsel        ?? s.image          ?? null,
    renk:          s.renk          ?? s.color          ?? null,
    hafiza:        s.hafiza        ?? s.memory         ?? null,
    imei:          s.imei          ?? null,
  }
}

const getCihaz = (s) => [s.marka, s.model].filter(Boolean).join(' ') || s.cihazTuru || '—'

/* ─── Progress Bar Animasyonu ────────────────────────────── */
function ProgressSteps({ durum }) {
  const aktifIdx = adimIndex(durum)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (aktifIdx === -1) {
    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <span className="text-4xl">↩️</span>
        <div>
          <p className="font-bold text-red-600 text-lg">İade Edildi</p>
          <p className="text-sm text-gray-500">Cihazınız iade edilmiştir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0">
        {ADIMLAR.map((adim, i) => {
          const tamamlandi = i <= aktifIdx
          const aktif      = i === aktifIdx
          const gelecek    = i > aktifIdx

          return (
            <div key={adim.key} className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 flex-1 min-w-0">
              {i > 0 && (
                <div className="hidden sm:block h-0.5 w-full -translate-y-5 relative">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div
                    className={`absolute inset-0 bg-amber-400 rounded-full transition-all duration-700 ease-out ${animated ? '' : 'w-0'}`}
                    style={{ width: tamamlandi && animated ? '100%' : '0%', transitionDelay: `${i * 150}ms` }}
                  />
                </div>
              )}

              {i > 0 && (
                <div className="sm:hidden w-0.5 h-6 ml-4 relative">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
                  <div
                    className={`absolute inset-0 bg-amber-400 transition-all duration-500`}
                    style={{ height: tamamlandi && animated ? '100%' : '0%', transitionDelay: `${i * 150}ms` }}
                  />
                </div>
              )}

              <div className="flex sm:flex-col items-center gap-2 sm:gap-1 shrink-0">
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-base
                  transition-all duration-500 border-2 shrink-0
                  ${aktif
                    ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/40'
                    : tamamlandi
                    ? 'border-amber-400 bg-amber-400 text-white'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400'}
                `}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {aktif && (
                    <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
                  )}
                  <span className="relative z-10">{adim.icon}</span>
                </div>

                <p className={`text-xs font-semibold text-center leading-tight hidden sm:block ${
                  aktif ? 'text-amber-600 dark:text-amber-400' : tamamlandi ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                }`}>
                  {adim.kisa}
                </p>

                <div className="sm:hidden">
                  <p className={`text-sm font-semibold ${
                    aktif ? 'text-amber-600 dark:text-amber-400' : tamamlandi ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                  }`}>{adim.label}</p>
                  {aktif && <p className="text-xs text-amber-500 mt-0.5">← Mevcut durum</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden sm:block text-center mt-3">
        <span className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{durum}</span>
        </span>
      </div>
    </div>
  )
}

/* ─── Arama Formu ────────────────────────────────────────── */
function AramaFormu({ kayitlar, onBul }) {
  const [kod, setKod] = useState('')
  const [hata, setHata] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const ara = () => {
    const id = parseInt(kod.replace(/[^0-9]/g, ''))
    if (!id) { setHata('Lütfen geçerli bir servis kodu girin.'); return }
    const kayit = kayitlar.find(s => s.id === id)
    if (!kayit) { setHata(`#${id} numaralı servis kaydı bulunamadı.`); return }
    onBul(kayit)
    setHata('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black">G</div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white text-sm">{FIRMA.ad}</p>
            <p className="text-xs text-gray-400">{FIRMA.sub}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-black text-gray-800 dark:text-white">Servis Takip</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Servis numaranızı girerek cihazınızın durumunu öğrenin.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Servis Numarası
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">#</span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="1234"
                    value={kod}
                    onChange={e => { setKod(e.target.value); setHata('') }}
                    onKeyDown={e => e.key === 'Enter' && ara()}
                    className="w-full pl-7 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono"
                  />
                </div>
                <button
                  onClick={ara}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Sorgula
                </button>
              </div>
              {hata && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
                  <span>⚠️</span>{hata}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Servis numaranızı teslim aldığınız fiş üzerinden bulabilirsiniz.
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            {FIRMA.web} · {FIRMA.tel}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Takip Kartı ────────────────────────────────────────── */
function TakipKarti({ kayit, onGeriDon }) {
  const cihad      = getCihaz(kayit)
  const cihazEmoji = CIHAZ_EMOJI[kayit.cihazTuru] || '🔧'
  const tahmini    = tarihTR(kayit.tahminiTarih)

  const waLink = () => {
    const msg = `Merhaba, servis numaram ${kayit.id} olan ${cihad} cihazımla ilgili bilgi almak istiyorum.`
    window.open(`https://wa.me/${FIRMA.waNo}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-sm">G</div>
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{FIRMA.ad}</p>
              <p className="text-[10px] text-gray-400">{FIRMA.sub}</p>
            </div>
          </div>
          <button
            onClick={onGeriDon}
            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer flex items-center gap-1"
          >
            ← Yeni sorgula
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-4">

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Servis <strong className="text-gray-700 dark:text-gray-200 font-mono">#{kayit.id}</strong>
            {kayit.tarih && <span> · {new Date(kayit.tarih + 'T00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>}
          </p>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            kayit.durum === 'Teslim Edildi' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            kayit.durum === 'Hazır'         ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            kayit.durum === 'Tamirde'       ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
            kayit.durum === 'İade'          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {kayit.durum}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-gray-700 flex items-center justify-center text-3xl">
              {cihazEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-800 dark:text-white text-lg leading-tight">{cihad}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{kayit.cihazTuru}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {kayit.renk   && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{kayit.renk}</span>}
                {kayit.hafiza && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{kayit.hafiza}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Servis Durumu</p>
          <ProgressSteps durum={kayit.durum} />
        </div>

        {(tahmini || kayit.teknisyenNotu) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-3">
            {tahmini && kayit.durum !== 'Teslim Edildi' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-base shrink-0">
                  📅
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tahmini Tamamlanma</p>
                  <p className="font-semibold text-gray-800 dark:text-white mt-0.5">{tahmini}</p>
                </div>
              </div>
            )}

            {kayit.teknisyenNotu && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-base shrink-0">
                  💬
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teknisyen Notu</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">{kayit.teknisyenNotu}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {kayit.durum === 'Hazır' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">Cihazınız hazır!</p>
              <p className="text-sm text-green-600 dark:text-green-400">Teslim almak için servisimizi arayabilirsiniz.</p>
            </div>
          </div>
        )}

        {kayit.durum === 'Teslim Edildi' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-blue-800 dark:text-blue-300">Servis tamamlandı</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Cihazınız teslim edildi. Bizi tercih ettiğiniz için teşekkürler!</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">İletişim</p>
          <div className="flex gap-2">
            <button
              onClick={waLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25d366] hover:bg-[#1da851] text-white font-semibold text-sm rounded-xl cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp ile Yaz
            </button>
            <a
              href={`tel:${FIRMA.tel.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ara
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          {FIRMA.web} · {FIRMA.tel}
        </p>
      </div>
    </div>
  )
}

/* ─── Ana Sayfa ──────────────────────────────────────────── */
export default function TakipPage() {
  const { servisNo } = useParams()
  const [searchParams] = useSearchParams()
  const { services } = useData()
  const [kayit, setKayit] = useState(null)

  const kayitlar = useMemo(() => services.map(normalize), [services])

  useEffect(() => {
    const id = parseInt(servisNo || searchParams.get('kod') || '')
    if (id) {
      const bulunan = kayitlar.find(s => s.id === id)
      setKayit(bulunan || null)
    }
  }, [servisNo, searchParams, kayitlar])

  if (kayit) {
    return <TakipKarti kayit={kayit} onGeriDon={() => setKayit(null)} />
  }

  return <AramaFormu kayitlar={kayitlar} onBul={setKayit} />
}
