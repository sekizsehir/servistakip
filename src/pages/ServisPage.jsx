import { useState, useCallback, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import QuickActions from '../components/servis/QuickActions'
import StatCards from '../components/servis/StatCards'
import ServisListesi from '../components/servis/ServisListesi'
import ServisForm from '../components/servis/ServisForm'
import TeklifForm from '../components/servis/TeklifForm'
import FinansalOzet from '../components/servis/FinansalOzet'
import Button from '../components/shared/Button'
import { useData } from '../context/DataContext'

// Supabase (snake_case) + seed (camelCase) + eski (Türkçe) → UI (Türkçe)
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
    tutar:         Number(s.tutar   ?? s.price          ?? s.materialCost   ?? 0),
    malzeme:       Number(s.malzeme ?? s.material_cost  ?? s.materialCost   ?? 0),
    odenen:        Number(s.odened  ?? s.odenen         ?? s.prepaid        ?? 0),
    gorsel:        s.gorsel         ?? s.image_url      ?? s.image          ?? null,
    renk:          s.renk           ?? s.color          ?? null,
    hafiza:        s.hafiza         ?? s.memory         ?? null,
    imei:          s.imei           ?? null,
  }
}

export default function ServisPage() {
  const { services, addService, updateService, deleteService } = useData()
  const [formAcik, setFormAcik] = useState(false)
  const [teklifAcik, setTeklifAcik] = useState(false)
  const [duzenleKayit, setDuzenleKayit] = useState(null)

  const kayitlar = useMemo(() => services.map(normalize), [services])

  const handleSave = useCallback((yeniKayit) => {
    // Supabase snake_case kolon adlarıyla kaydet
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

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm">
          <QuickActions />
        </div>

        <StatCards kayitlar={kayitlar} />

        <div>
          <div className="flex items-center justify-end gap-2 mb-3">
            <Button variant="ghost" icon="📄" onClick={() => setTeklifAcik(true)}>
              Teklif Oluştur
            </Button>
            <Button icon="➕" onClick={() => { setDuzenleKayit(null); setFormAcik(true) }}>
              Yeni Servis
            </Button>
          </div>
          <ServisListesi
            kayitlar={kayitlar}
            onDurumChange={handleDurumChange}
            onDuzenle={handleDuzenle}
            onSil={handleSil}
          />
        </div>

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
