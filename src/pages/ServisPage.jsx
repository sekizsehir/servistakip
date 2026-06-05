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

// Seed/DB (İngilizce camelCase) → UI (Türkçe) dönüşümü
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

export default function ServisPage() {
  const { services, addService, updateService, deleteService } = useData()
  const [formAcik, setFormAcik] = useState(false)
  const [teklifAcik, setTeklifAcik] = useState(false)
  const [duzenleKayit, setDuzenleKayit] = useState(null)

  const kayitlar = useMemo(() => services.map(normalize), [services])

  const handleSave = useCallback((yeniKayit) => {
    const kayit = {
      musteri:   yeniKayit.adSoyad,
      telefon:   yeniKayit.telefon,
      cihazTuru: yeniKayit.cihazTuru || 'Cep Telefonu',
      marka:     yeniKayit.marka || '',
      model:     yeniKayit.model || '',
      ariza:     yeniKayit.arizaAciklama || '—',
      pin:       yeniKayit.sifre || null,
      durum:     yeniKayit.durum || 'Beklemede',
      tarih:     new Date().toISOString().split('T')[0],
      teknisyen: '—',
      tutar:     parseFloat(yeniKayit.servisUcreti) || 0,
      malzeme:   parseFloat(yeniKayit.malzemeMaliyeti) || 0,
      odenen:    parseFloat(yeniKayit.onOdeme) || 0,
      gorsel:    yeniKayit.gorselUrl || null,
    }
    if (duzenleKayit) {
      updateService(duzenleKayit.id, kayit)
      setDuzenleKayit(null)
    } else {
      addService(kayit)
    }
  }, [duzenleKayit, addService, updateService])

  const handleDurumChange = useCallback((id, yeniDurum) => {
    updateService(id, { durum: yeniDurum })
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

        {/* Hızlı Eylemler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm">
          <QuickActions />
        </div>

        {/* İstatistik Kartları */}
        <StatCards kayitlar={kayitlar} />

        {/* Servis Listesi */}
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

        {/* Finansal Özet */}
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
