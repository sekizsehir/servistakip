import { useState, useCallback, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import QuickActions from '../components/servis/QuickActions'
import StatCards from '../components/servis/StatCards'
import ServisListesi from '../components/servis/ServisListesi'
import ServisForm from '../components/servis/ServisForm'
import TeklifForm from '../components/servis/TeklifForm'
import FinansalOzet from '../components/servis/FinansalOzet'
import { useData } from '../context/DataContext'

/* ─── DB → UI normalize ──────────────────────────────────── */
function normalize(s) {
  return {
    id:            s.id,
    musteri:       s.musteri        ?? s.customer_name  ?? s.name           ?? '—',
    telefon:       s.telefon        ?? s.customer_phone ?? s.phone          ?? '—',
    cihazTuru:     s.cihazTuru      ?? s.device_type    ?? s.deviceType     ?? '—',
    marka:         s.marka          ?? s.brand          ?? '',
    model:         s.model          ?? '',
    ariza:         s.ariza          ?? s.fault          ?? '—',
    pin:           s.pin            ?? null,
    durum:         s.durum          ?? s.status         ?? 'Beklemede',
    tarih:         s.tarih          ?? (s.created_at    ? s.created_at.split('T')[0]   : null),
    tahminiTarih:  s.tahminiTarih   ?? s.estimated_date ?? s.estimatedDate  ?? null,
    teknisyen:     s.teknisyen      ?? s.technician     ?? '—',
    teknisyenNotu: s.teknisyenNotu  ?? s.technician_note ?? s.technicianNote ?? null,
    tutar:         Number(s.tutar   ?? s.price          ?? 0),
    malzeme:       Number(s.malzeme ?? s.material_cost  ?? s.materialCost   ?? 0),
    odenen:        Number(s.odened  ?? s.odenen         ?? s.prepaid        ?? 0),
    gorsel:        s.gorsel         ?? s.image_url      ?? s.image          ?? null,
    renk:          s.renk           ?? s.color          ?? null,
    hafiza:        s.hafiza         ?? s.memory         ?? null,
    imei:          s.imei           ?? null,
  }
}

/* ─── Accordion Kart ─────────────────────────────────────── */
function AccordionKart({ icon, title, sub, open, onClick, children, fullWidth }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-white leading-tight">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && children && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-5">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Müşteri Arama ──────────────────────────────────────── */
function MusteriArama({ kayitlar }) {
  const [q, setQ] = useState('')

  const sonuclar = useMemo(() => {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    const musMap = {}
    kayitlar.forEach(k => {
      const isim = k.musteri || ''
      if (!isim.toLowerCase().includes(lower)) return
      if (!musMap[isim]) musMap[isim] = { isim, telefon: k.telefon, servisler: [] }
      musMap[isim].servisler.push(k)
    })
    return Object.values(musMap)
  }, [q, kayitlar])

  return (
    <div className="space-y-3">
      <input
        type="text"
        autoFocus
        placeholder="Müşteri adı veya telefon ara..."
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
      />
      {q.trim() && sonuclar.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Müşteri bulunamadı.</p>
      )}
      {sonuclar.map(m => (
        <div key={m.isim} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {m.isim[0]}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 dark:text-white">{m.isim}</p>
              <p className="text-xs text-gray-400">{m.telefon} · {m.servisler.length} servis</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {m.servisler.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">#{s.id} · {s.marka} {s.model}</p>
                  <p className="text-xs text-gray-400">{s.ariza}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.durum === 'Hazır' ? 'bg-green-100 text-green-700' :
                  s.durum === 'Tamirde' ? 'bg-orange-100 text-orange-700' :
                  s.durum === 'Teslim Edildi' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{s.durum}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Ana Sayfa ──────────────────────────────────────────── */
export default function ServisPage() {
  const { services, addService, updateService, deleteService } = useData()
  const [formAcik, setFormAcik] = useState(false)
  const [teklifAcik, setTeklifAcik] = useState(false)
  const [duzenleKayit, setDuzenleKayit] = useState(null)
  const [acik, setAcik] = useState({ musteri: false, servisler: true })

  const toggle = (key) => setAcik(a => ({ ...a, [key]: !a[key] }))

  const kayitlar = useMemo(() => services.map(normalize), [services])

  const handleSave = useCallback((yeniKayit) => {
    const kayit = {
      customer_name:  yeniKayit.adSoyad       || null,
      customer_phone: yeniKayit.telefon        || null,
      device_type:    yeniKayit.cihazTuru      || 'Cep Telefonu',
      brand:          yeniKayit.marka          || null,
      model:          yeniKayit.model          || null,
      fault:          yeniKayit.arizaAciklama  || null,
      pin:            yeniKayit.sifre          || null,
      status:         yeniKayit.durum          || 'Beklemede',
      price:          parseFloat(yeniKayit.servisUcreti)    || 0,
      material_cost:  parseFloat(yeniKayit.malzemeMaliyeti) || 0,
      prepaid:        parseFloat(yeniKayit.onOdeme)         || 0,
      image_url:      yeniKayit.gorselUrl      || null,
      color:          yeniKayit.renk           || null,
      memory:         yeniKayit.hafiza         || null,
      imei:           yeniKayit.imei           || null,
      battery_health: yeniKayit.pilSagligi     ? parseInt(yeniKayit.pilSagligi) : null,
      accessories:    yeniKayit.aksesuarlar    || [],
    }
    if (duzenleKayit) {
      updateService(duzenleKayit.id, kayit)
      setDuzenleKayit(null)
    } else {
      addService(kayit)
    }
  }, [duzenleKayit, addService, updateService])

  const handleDurumChange = useCallback((id, yeniDurum) => {
    updateService(id, { status: yeniDurum })
  }, [updateService])

  const handleDuzenle = useCallback((kayit) => {
    setDuzenleKayit(kayit)
    setFormAcik(true)
  }, [])

  const handleSil = useCallback((id) => {
    deleteService(id)
  }, [deleteService])

  return (
    <Layout>
      <div className="space-y-5">

        {/* Hızlı Araçlar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-5 py-3.5 shadow-sm">
          <QuickActions />
        </div>

        {/* İstatistik Kartları */}
        <StatCards kayitlar={kayitlar} />

        {/* 3 Accordion Kart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Yeni Servis Kaydı */}
          <AccordionKart
            icon="🛠️"
            title="Yeni Servis Kaydı"
            sub="Yeni kayıt eklemek için tıklayın"
            open={false}
            onClick={() => { setDuzenleKayit(null); setFormAcik(true) }}
          />

          {/* Müşteri Takibi */}
          <AccordionKart
            icon="🔍"
            title="Müşteri Takibi & Geçmişi"
            sub="Müşteri aramak için tıklayın"
            open={acik.musteri}
            onClick={() => toggle('musteri')}
          >
            <MusteriArama kayitlar={kayitlar} />
          </AccordionKart>

          {/* Yeni Teklif */}
          <AccordionKart
            icon="📄"
            title="Yeni Teklif"
            sub="Müşteriye fiyat teklifi hazırlayın"
            open={false}
            onClick={() => setTeklifAcik(true)}
          />
        </div>

        {/* Mevcut Servis Kayıtları */}
        <AccordionKart
          icon="📋"
          title="Mevcut Servis Kayıtları"
          sub={`${kayitlar.length} kayıt · görüntülemek için tıklayın`}
          open={acik.servisler}
          onClick={() => toggle('servisler')}
        >
          <ServisListesi
            kayitlar={kayitlar}
            onDurumChange={handleDurumChange}
            onDuzenle={handleDuzenle}
            onSil={handleSil}
          />
        </AccordionKart>

        {/* Kasa Özeti */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <FinansalOzet kayitlar={kayitlar} />
        </div>

      </div>

      <ServisForm
        isOpen={formAcik}
        onClose={() => { setFormAcik(false); setDuzenleKayit(null) }}
        onSave={handleSave}
      />
      <TeklifForm
        isOpen={teklifAcik}
        onClose={() => setTeklifAcik(false)}
      />
    </Layout>
  )
}
