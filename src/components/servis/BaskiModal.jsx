import { useRef, forwardRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import Modal from '../shared/Modal'

/* ─── Firma bilgileri ─────────────────────────────────────── */
const FIRMA = {
  ad:           'G Servis Takip',
  altbaslik:    'Teknik Servis Merkezi',
  adres:        'Örnek Mah. Servis Cad. No:1, İstanbul',
  tel:          '0212 XXX XX XX',
  web:          'servis.genixsoft.com.tr',
  email:        'info@genixsoft.com.tr',
  vergiDairesi: 'İstanbul Vergi Dairesi',
  vergiNo:      '123 456 7890',
}

/* ─── Yardımcılar ────────────────────────────────────────── */
const fmt = (v) => (Math.abs(parseFloat(v) || 0)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })
const tarihTR = (d) => d ? new Date(d + 'T00:00').toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   1. MÜŞTERİ FİŞİ
══════════════════════════════════════════════════════════ */
const MusteriFisi = forwardRef(function MusteriFisi({ kayit, kdvOran = 0 }, ref) {
  const tutar  = parseFloat(kayit.tutar)  || 0
  const odenen = parseFloat(kayit.odened ?? kayit.odenen) || 0
  const kalan  = tutar - odened
  const kdv    = tutar * kdvOran
  const aksesuar = kayit.aksesuarlar || []

  return (
    <div ref={ref}>
      <style>{`
        @page { size: A5; margin: 12mm; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #1f2937; }
        .fis { max-width: 148mm; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f59e0b; padding-bottom: 10px; margin-bottom: 12px; }
        .firma-ad { font-size: 18px; font-weight: 900; color: #f59e0b; letter-spacing: -0.5px; }
        .firma-sub { font-size: 10px; color: #9ca3af; margin-top: 2px; }
        .servis-no { text-align: right; }
        .servis-no h2 { font-size: 13px; font-weight: 700; color: #1f2937; }
        .servis-no p { font-size: 10px; color: #9ca3af; margin-top: 2px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .blok { background: #f9fafb; border-radius: 6px; padding: 10px 12px; }
        .blok-baslik { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #f59e0b; margin-bottom: 6px; }
        .blok-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .blok-label { color: #6b7280; }
        .blok-val { font-weight: 600; color: #1f2937; }
        .section { border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
        .section-title { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
        .ariza-text { font-size: 12px; color: #1f2937; line-height: 1.5; }
        .aks-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .aks-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #374151; }
        .aks-box { width: 12px; height: 12px; border: 1.5px solid #d1d5db; border-radius: 2px; background: ${aksesuar.length ? '#f59e0b' : 'white'}; display: inline-block; }
        .ucret-tablo { width: 100%; border-collapse: collapse; }
        .ucret-tablo td { padding: 4px 8px; font-size: 11px; }
        .ucret-tablo tr:not(:last-child) td { border-bottom: 1px dashed #e5e7eb; }
        .ucret-tablo .label { color: #6b7280; }
        .ucret-tablo .val { text-align: right; font-weight: 600; }
        .ucret-tablo .grand td { background: #1f2937; color: white; font-weight: 700; font-size: 12px; border-radius: 4px; }
        .imza-alan { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
        .imza-line { border-bottom: 1px solid #d1d5db; height: 40px; margin: 8px 0 6px; }
        .imza-text { font-size: 9px; color: #9ca3af; line-height: 1.4; }
        .footer { text-align: center; border-top: 1px dashed #e5e7eb; padding-top: 8px; font-size: 9px; color: #9ca3af; }
        .footer strong { color: #f59e0b; }
        .pin-box { display: inline-block; background: #fef3c7; border: 1px solid #fde68a; border-radius: 4px; padding: 1px 6px; font-family: monospace; font-size: 11px; font-weight: 700; color: #92400e; }
      `}</style>

      <div className="fis">
        {/* Başlık */}
        <div className="header">
          <div>
            <div className="firma-ad">{FIRMA.ad}</div>
            <div className="firma-sub">{FIRMA.altbaslik}</div>
            <div className="firma-sub" style={{marginTop:'4px'}}>{FIRMA.adres}</div>
            <div className="firma-sub">{FIRMA.tel} · {FIRMA.email}</div>
          </div>
          <div className="servis-no">
            <h2>SERVİS FİŞİ</h2>
            <p>No: <strong>#{kayit.id}</strong></p>
            <p>Tarih: <strong>{tarihTR(kayit.tarih)}</strong></p>
            {kayit.teknisyen && <p>Teknisyen: <strong>{kayit.teknisyen}</strong></p>}
          </div>
        </div>

        {/* Müşteri + Cihaz */}
        <div className="grid2">
          <div className="blok">
            <div className="blok-baslik">Müşteri Bilgileri</div>
            <div className="blok-row"><span className="blok-label">Ad Soyad:</span><span className="blok-val">{kayit.musteri||'—'}</span></div>
            <div className="blok-row"><span className="blok-label">Telefon:</span><span className="blok-val">{kayit.telefon||'—'}</span></div>
          </div>
          <div className="blok">
            <div className="blok-baslik">Cihaz Bilgileri</div>
            <div className="blok-row"><span className="blok-label">Cihaz:</span><span className="blok-val">{[kayit.marka,kayit.model].filter(Boolean).join(' ')||kayit.cihazTuru||'—'}</span></div>
            {kayit.imei   && <div className="blok-row"><span className="blok-label">IMEI:</span><span className="blok-val" style={{fontSize:'9px',fontFamily:'monospace'}}>{kayit.imei}</span></div>}
            {kayit.renk   && <div className="blok-row"><span className="blok-label">Renk:</span><span className="blok-val">{kayit.renk}</span></div>}
            {kayit.hafiza && <div className="blok-row"><span className="blok-label">Hafıza:</span><span className="blok-val">{kayit.hafiza}</span></div>}
            {kayit.pil != null && <div className="blok-row"><span className="blok-label">Pil:</span><span className="blok-val">%{kayit.pil}</span></div>}
            {kayit.pin && <div className="blok-row"><span className="blok-label">Şifre:</span><span className="pin-box">{kayit.pin}</span></div>}
          </div>
        </div>

        {/* Arıza */}
        <div className="section">
          <div className="section-title">Arıza Açıklaması</div>
          <div className="ariza-text">{kayit.ariza||'—'}</div>
        </div>

        {/* Aksesuarlar */}
        <div className="section">
          <div className="section-title">Teslim Alınan Aksesuarlar</div>
          <div className="aks-grid">
            {['Şarj Aleti','Kulaklık','Kılıf','Koruyucu Cam','Kutu','Diğer'].map(ak => (
              <div className="aks-item" key={ak}>
                <span className="aks-box" style={{background:aksesuar.includes(ak)?'#f59e0b':'white'}} />
                {ak}
              </div>
            ))}
          </div>
          {aksesuar.length === 0 && <p style={{fontSize:'10px',color:'#9ca3af',marginTop:'4px'}}>Aksesuar teslim alınmadı.</p>}
        </div>

        {/* Ücret */}
        <div className="section">
          <div className="section-title">Ücret Bilgisi</div>
          <table className="ucret-tablo">
            <tbody>
              <tr><td className="label">Servis Ücreti</td><td className="val">₺{fmt(tutar)}</td></tr>
              {kdvOran > 0 && <tr><td className="label">KDV (%{(kdvOran*100).toFixed(0)})</td><td className="val">₺{fmt(kdv)}</td></tr>}
              {odenen > 0  && <tr><td className="label">Ödenen</td><td className="val" style={{color:'#22c55e'}}>- ₺{fmt(odened)}</td></tr>}
              <tr className="grand">
                <td style={{borderRadius:'4px 0 0 4px'}}>KALAN ÖDEME</td>
                <td className="val" style={{borderRadius:'0 4px 4px 0'}}>₺{fmt(kalan + (kdvOran>0?kdv:0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* İmza */}
        <div className="imza-alan">
          <div className="section-title">Müşteri İmzası</div>
          <div className="imza-line" />
          <div className="imza-text">
            Cihazım {tarihTR(kayit.tarih)} tarihinde {FIRMA.ad}'e teslim edilmiştir. Yukarıdaki bilgilerin doğruluğunu onaylıyorum.
            Onarım tamamlandığında haberdar edilmek istiyorum.
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <strong>{FIRMA.web}</strong> üzerinden servis durumunuzu takip edebilirsiniz.<br/>
          {FIRMA.tel} · {FIRMA.adres}
        </div>
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   2. CİHAZ ETİKETİ
══════════════════════════════════════════════════════════ */
const CihazEtiketi = forwardRef(function CihazEtiketi({ kayit }, ref) {
  const qrUrl = `https://${FIRMA.web}/takip/${kayit.id}`
  const cihazAd = [kayit.marka, kayit.model].filter(Boolean).join(' ') || kayit.cihazTuru || '—'

  return (
    <div ref={ref}>
      <style>{`
        @page { size: 90mm 40mm; margin: 2mm; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; }
        .etiket {
          width: 86mm; height: 36mm;
          border: 1.5px solid #1f2937;
          border-radius: 4px;
          display: flex;
          overflow: hidden;
        }
        .sol { flex: 1; padding: 4mm 3mm; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
        .musteri { font-size: 11px; font-weight: 900; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tel { font-size: 9.5px; color: #4b5563; margin-top: 1px; }
        .cihaz { font-size: 10px; font-weight: 700; color: #1f2937; margin-top: 2mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ariza { font-size: 8.5px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .alt { display: flex; align-items: center; gap: 4px; margin-top: 1.5mm; }
        .tarih-badge { background: #f59e0b; color: white; font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
        .pin-badge { background: #fef3c7; border: 1px solid #fde68a; color: #92400e; font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 3px; font-family: monospace; }
        .no-badge { background: #f3f4f6; color: #6b7280; font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 3px; }
        .sag { width: 30mm; background: #f9fafb; border-left: 1px solid #e5e7eb; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 2mm; }
        .sag-firma { font-size: 7px; font-weight: 900; color: #f59e0b; letter-spacing: 0.5px; }
        .sag-url { font-size: 6px; color: #9ca3af; text-align: center; }
      `}</style>
      <div className="etiket">
        <div className="sol">
          <div>
            <div className="musteri">{kayit.musteri || '—'}</div>
            <div className="tel">{kayit.telefon || ''}</div>
            <div className="cihaz">{cihazAd}</div>
            <div className="ariza">{kayit.ariza || ''}</div>
          </div>
          <div className="alt">
            <span className="tarih-badge">📅 {kayit.tarih || '—'}</span>
            {kayit.pin && <span className="pin-badge">🔒 {kayit.pin}</span>}
            <span className="no-badge">#{kayit.id}</span>
          </div>
        </div>
        <div className="sag">
          <QRCodeSVG value={qrUrl} size={72} level="M" fgColor="#1f2937" />
          <div className="sag-firma">{FIRMA.ad}</div>
          <div className="sag-url">{FIRMA.web}</div>
        </div>
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   3. FATURA
══════════════════════════════════════════════════════════ */
const Fatura = forwardRef(function Fatura({ kayit, kdvOran = 0.20 }, ref) {
  const tutar     = parseFloat(kayit.tutar) || 0
  const malzeme   = parseFloat(kayit.malzeme) || 0
  const kdvMatrah = tutar + malzeme
  const kdvTutar  = kdvMatrah * kdvOran
  const genelTop  = kdvMatrah + kdvTutar
  const odened    = parseFloat(kayit.odened ?? kayit.odenen) || 0
  const kalan     = genelTop - odened
  const faturaNo  = `FAT-${new Date().getFullYear()}-${String(kayit.id).padStart(4,'0')}`

  return (
    <div ref={ref}>
      <style>{`
        @page { size: A4; margin: 15mm; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1f2937; }
        .fatura { max-width: 180mm; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #f59e0b; }
        .firma-ad { font-size: 22px; font-weight: 900; color: #f59e0b; }
        .firma-info { font-size: 10px; color: #6b7280; margin-top: 4px; line-height: 1.6; }
        .fat-baslik h1 { font-size: 20px; font-weight: 700; text-align: right; }
        .fat-baslik p { font-size: 11px; color: #6b7280; text-align: right; margin-top: 3px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .bilgi-kutu { background: #f9fafb; border-radius: 6px; padding: 12px 14px; }
        .bilgi-baslik { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px; }
        .bilgi-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
        .bilgi-label { color: #6b7280; }
        .bilgi-val { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #1f2937; color: white; }
        th { padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 600; }
        td { padding: 9px 12px; border-bottom: 1px solid #f3f4f6; font-size: 11px; }
        tr:nth-child(even) td { background: #f9fafb; }
        .right { text-align: right; }
        .totals { margin-left: auto; width: 260px; }
        .trow { display: flex; justify-content: space-between; padding: 6px 10px; font-size: 12px; border-bottom: 1px solid #f3f4f6; }
        .trow.sub { background: #fffbeb; }
        .trow.grand { background: #f59e0b; color: white; font-weight: 700; font-size: 15px; padding: 10px 12px; border-radius: 6px; margin-top: 6px; border: none; }
        .notes { margin-top: 24px; font-size: 10px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; }
        .footer-stamp { display: flex; justify-content: space-between; margin-top: 40px; }
        .stamp-box { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 20px; text-align: center; min-width: 120px; }
        .stamp-label { font-size: 9px; color: #9ca3af; margin-bottom: 28px; }
        .footer-bar { margin-top: 24px; text-align: center; font-size: 9px; color: #d1d5db; border-top: 1px solid #f3f4f6; padding-top: 10px; }
      `}</style>

      <div className="fatura">
        {/* Başlık */}
        <div className="header">
          <div>
            <div className="firma-ad">{FIRMA.ad}</div>
            <div className="firma-info">
              {FIRMA.adres}<br/>
              Tel: {FIRMA.tel} · E-posta: {FIRMA.email}<br/>
              Vergi Dairesi: {FIRMA.vergiDairesi} · V.No: {FIRMA.vergiNo}
            </div>
          </div>
          <div className="fat-baslik">
            <h1>FATURA</h1>
            <p>No: <strong>{faturaNo}</strong></p>
            <p>Tarih: <strong>{tarihTR(kayit.tarih)}</strong></p>
            <p>Servis No: <strong>#{kayit.id}</strong></p>
          </div>
        </div>

        {/* Müşteri + Ödeme bilgisi */}
        <div className="grid2">
          <div className="bilgi-kutu">
            <div className="bilgi-baslik">Alıcı Bilgileri</div>
            <div className="bilgi-row"><span className="bilgi-label">Ad Soyad:</span><span className="bilgi-val">{kayit.musteri||'—'}</span></div>
            <div className="bilgi-row"><span className="bilgi-label">Telefon:</span><span className="bilgi-val">{kayit.telefon||'—'}</span></div>
          </div>
          <div className="bilgi-kutu">
            <div className="bilgi-baslik">Ödeme Bilgisi</div>
            <div className="bilgi-row"><span className="bilgi-label">Durum:</span><span className="bilgi-val" style={{color: kalan>0?'#ef4444':'#22c55e'}}>{kalan>0?'Kısmi Ödendi':'Ödendi'}</span></div>
            <div className="bilgi-row"><span className="bilgi-label">Ödenen:</span><span className="bilgi-val" style={{color:'#22c55e'}}>₺{fmt(odened)}</span></div>
            {kalan>0 && <div className="bilgi-row"><span className="bilgi-label">Kalan:</span><span className="bilgi-val" style={{color:'#ef4444'}}>₺{fmt(kalan)}</span></div>}
          </div>
        </div>

        {/* Hizmet tablosu */}
        <table>
          <thead>
            <tr>
              <th style={{width:'30px'}}>#</th>
              <th>Hizmet / Ürün Açıklaması</th>
              <th className="right" style={{width:'80px'}}>Miktar</th>
              <th className="right" style={{width:'100px'}}>Birim Fiyat</th>
              <th className="right" style={{width:'100px'}}>Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>Servis Ücreti</strong> — {[kayit.marka,kayit.model].filter(Boolean).join(' ')||kayit.cihazTuru||'Cihaz'}
                <br/><span style={{fontSize:'10px',color:'#6b7280'}}>{kayit.ariza||''}</span>
              </td>
              <td className="right">1</td>
              <td className="right">₺{fmt(tutar)}</td>
              <td className="right">₺{fmt(tutar)}</td>
            </tr>
            {malzeme > 0 && (
              <tr>
                <td>2</td>
                <td><strong>Malzeme</strong> — Yedek parça ve sarf malzeme</td>
                <td className="right">1</td>
                <td className="right">₺{fmt(malzeme)}</td>
                <td className="right">₺{fmt(malzeme)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tutarlar */}
        <div className="totals">
          <div className="trow"><span>Ara Toplam (KDV Hariç)</span><span>₺{fmt(kdvMatrah)}</span></div>
          <div className="trow sub">
            <span>KDV (%{(kdvOran*100).toFixed(0)})</span>
            <span>₺{fmt(kdvTutar)}</span>
          </div>
          <div className="trow grand"><span>GENEL TOPLAM</span><span>₺{fmt(genelTop)}</span></div>
        </div>

        {/* Notlar */}
        <div className="notes">
          Bu fatura {tarihTR(kayit.tarih)} tarihinde düzenlenmiştir. Ödeme yapılmadığı takdirde yasal işlem başlatılacaktır.
        </div>

        {/* İmza alanları */}
        <div className="footer-stamp">
          <div className="stamp-box">
            <div className="stamp-label">Müşteri İmzası</div>
            <div style={{fontSize:'9px',color:'#9ca3af'}}>{kayit.musteri||''}</div>
          </div>
          <div className="stamp-box">
            <div className="stamp-label">Kaşe / İmza</div>
            <div style={{fontSize:'9px',color:'#9ca3af'}}>{FIRMA.ad}</div>
          </div>
        </div>

        <div className="footer-bar">
          {FIRMA.web} · {FIRMA.tel} · {FIRMA.adres}
        </div>
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   BaskiModal — 3 belge seçimi
══════════════════════════════════════════════════════════ */
export default function BaskiModal({ kayit, onClose }) {
  const [kdvOran, setKdvOran] = useState(0.20)

  const fisRef     = useRef(null)
  const etiketRef  = useRef(null)
  const faturaRef  = useRef(null)

  const printFis    = useReactToPrint({ contentRef: fisRef,    documentTitle: `Servis-Fisi-${kayit.id}` })
  const printEtiket = useReactToPrint({ contentRef: etiketRef, documentTitle: `Cihaz-Etiketi-${kayit.id}` })
  const printFatura = useReactToPrint({ contentRef: faturaRef, documentTitle: `Fatura-${kayit.id}` })

  const belgeKartlari = [
    {
      id: 'fis',
      icon: '🧾',
      baslik: 'Müşteri Fişi',
      aciklama: 'Servis makbuzu · A5 boyut · İmza alanı dahil',
      renk: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
      butonRenk: 'bg-amber-500 hover:bg-amber-600',
      onPrint: () => printFis(),
    },
    {
      id: 'etiket',
      icon: '🏷️',
      baslik: 'Cihaz Etiketi',
      aciklama: '90×40 mm label · QR kod dahil · Cihaz üzerine yapıştır',
      renk: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      butonRenk: 'bg-blue-500 hover:bg-blue-600',
      onPrint: () => printEtiket(),
    },
    {
      id: 'fatura',
      icon: '🧾',
      baslik: 'Fatura',
      aciklama: 'A4 · Standart fatura formatı · KDV satırları dahil',
      renk: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
      butonRenk: 'bg-green-500 hover:bg-green-600',
      onPrint: () => printFatura(),
    },
  ]

  return (
    <Modal isOpen onClose={onClose} title={`🖨️ Belge Yazdır — #${kayit.id} · ${kayit.musteri || '—'}`} size="md">
      <div className="space-y-4">
        {/* KDV Seçimi */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">KDV Oranı:</span>
          <div className="flex gap-1.5">
            {[{l:'%0',v:0},{l:'%10',v:0.10},{l:'%20',v:0.20}].map(k => (
              <button key={k.l} onClick={() => setKdvOran(k.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${kdvOran===k.v
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'}`}
              >{k.l}</button>
            ))}
          </div>
        </div>

        {/* Belge kartları */}
        <div className="space-y-3">
          {belgeKartlari.map(b => (
            <div key={b.id} className={`flex items-center gap-4 rounded-xl border p-4 ${b.renk}`}>
              <span className="text-3xl shrink-0">{b.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 dark:text-white text-sm">{b.baslik}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{b.aciklama}</p>
              </div>
              <button
                onClick={b.onPrint}
                className={`px-4 py-2 rounded-lg ${b.butonRenk} text-white text-sm font-semibold cursor-pointer transition-colors shrink-0`}
              >
                Yazdır
              </button>
            </div>
          ))}
        </div>

        {/* Bilgi */}
        <p className="text-xs text-gray-400 text-center">
          Yazıcı ayarlarından "Kenar boşlukları: Yok" seçeneğini etkinleştirin.
        </p>
      </div>

      {/* Gizli print bileşenleri (DOM'da ama görünmez) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <MusteriFisi ref={fisRef}    kayit={kayit} kdvOran={kdvOran} />
        <CihazEtiketi ref={etiketRef} kayit={kayit} />
        <Fatura        ref={faturaRef} kayit={kayit} kdvOran={kdvOran} />
      </div>
    </Modal>
  )
}
