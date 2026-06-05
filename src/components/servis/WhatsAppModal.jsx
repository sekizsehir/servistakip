import { useState, useCallback } from 'react'
import Modal from '../shared/Modal'

/* ─── Sabitler ───────────────────────────────────────────── */
const WEB    = 'servis.genixsoft.com.tr'
const FIRMA  = 'G Servis Takip'

const fmt = (v) =>
  (parseFloat(v) || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0 })

/* ─── Şablon oluşturucular ───────────────────────────────── */
const cihazAd = (k) =>
  [k?.marka, k?.model].filter(Boolean).join(' ') || k?.cihazTuru || 'Cihazınız'

const takipLink = (k) =>
  `https://${WEB}/takip/${k?.id || '—'}`

function buildSablon(tip, kayit) {
  const musteri = kayit?.musteri || '[MÜŞTERİ]'
  const cihaz   = cihazAd(kayit)
  const no      = `#${kayit?.id || '—'}`
  const link    = takipLink(kayit)
  const tutar   = fmt(kayit?.tutar)
  const odenen  = fmt(kayit?.odened ?? kayit?.odenen)
  const kalan   = fmt((parseFloat(kayit?.tutar) || 0) - (parseFloat(kayit?.odened ?? kayit?.odenen) || 0))

  if (tip === 'kabul') return `Sayın ${musteri},

${cihaz} cihazınız servisimize teslim alındı. ✅

📋 Takip Kodu: ${no}
🔗 Durumu takip etmek için: ${link}

Cihazınız hazır olduğunda sizi bilgilendireceğiz.
Herhangi bir sorunuz için bizi arayabilirsiniz.

_${FIRMA}_`

  if (tip === 'hazir') {
    const lines = [
      `Sayın ${musteri},`,
      ``,
      `${cihaz} cihazınız hazır! 🎉`,
      ``,
    ]
    if (kayit?.tutar  > 0) lines.push(`💰 Servis Ücreti: ₺${tutar}`)
    if ((parseFloat(kayit?.odened ?? kayit?.odenen) || 0) > 0) lines.push(`✅ Ödenen: ₺${odened}`)
    if ((parseFloat(kayit?.tutar) || 0) - (parseFloat(kayit?.odened ?? kayit?.odenen) || 0) > 0)
      lines.push(`⏳ Kalan Ödeme: ₺${kalan}`)
    lines.push(``, `📍 Teslim almak için lütfen iletişime geçin.`)
    lines.push(`🔗 ${link}`, ``, `_${FIRMA}_`)
    return lines.join('\n')
  }

  if (tip === 'teklif') return `*📋 FİYAT TEKLİFİ — ${no}*
${new Date().toLocaleDateString('tr-TR')}

*Sayın:* ${musteri}
*Cihaz:* ${cihaz}
*Arıza:* ${kayit?.ariza || '[ARIZA]'}

━━━━━━━━━━━━━━━━━━

*📦 Malzeme & İşçilik:*
• Servis Ücreti: ₺${tutar}

*🏷️ Toplam: ₺${tutar}*

━━━━━━━━━━━━━━━━━━
Bu teklif ${new Date().toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.
${link}

_${FIRMA}_`

  return ''
}

/* ─── Mesaj Kartı ────────────────────────────────────────── */
function MesajKarti({ tip, baslik, aciklama, renk, kayit, tel, onTelChange }) {
  const renkler = {
    amber: { card: 'border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-900/10', btn: 'bg-amber-500 hover:bg-amber-600', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    green: { card: 'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/10',  btn: 'bg-green-500 hover:bg-green-600',  badge: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-400' },
    blue:  { card: 'border-blue-200  bg-blue-50/50  dark:border-blue-800/50  dark:bg-blue-900/10',   btn: 'bg-blue-500  hover:bg-blue-600',   badge: 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-400' },
  }
  const c = renkler[renk] || renkler.amber

  const [metin, setMetin] = useState(() => buildSablon(tip, kayit))
  const [copied, setCopied] = useState(false)

  const kopyala = useCallback(() => {
    navigator.clipboard.writeText(metin).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [metin])

  const gonder = useCallback(() => {
    const no = (tel || '').replace(/\D/g, '')
    const tam = no.startsWith('90') ? no : `90${no.replace(/^0/, '')}`
    const url = `https://wa.me/${tam}?text=${encodeURIComponent(metin)}`
    window.open(url, '_blank', 'noopener')
  }, [tel, metin])

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${c.card}`}>
      {/* Başlık */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-gray-800 dark:text-white text-sm">{baslik}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{aciklama}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${c.badge}`}>
          {metin.length} karakter
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={metin}
        onChange={e => setMetin(e.target.value)}
        rows={7}
        className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 dark:text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono leading-relaxed"
      />

      {/* Aksiyonlar */}
      <div className="flex items-center gap-2">
        {/* Telefon */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">📱</span>
          <input
            type="tel"
            placeholder="05XX XXX XX XX"
            value={tel}
            onChange={e => onTelChange(e.target.value)}
            className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* Kopyala */}
        <button
          onClick={kopyala}
          title="Metni kopyala"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            copied
              ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-amber-300 hover:text-amber-600'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Kopyalandı
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Kopyala
            </>
          )}
        </button>

        {/* WhatsApp Gönder */}
        <button
          onClick={gonder}
          disabled={!tel?.trim()}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg ${c.btn} text-white text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm`}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Gönder
        </button>
      </div>
    </div>
  )
}

/* ─── Ana Modal ──────────────────────────────────────────── */
const SABLON_TANIMLARI = [
  {
    tip:      'kabul',
    baslik:   '📥 Servis Kabul Mesajı',
    aciklama: 'Cihaz teslim alındığında müşteriye gönderin',
    renk:     'amber',
  },
  {
    tip:      'hazir',
    baslik:   '✅ Servis Hazır Mesajı',
    aciklama: 'Cihaz teslime hazır olduğunda gönderin',
    renk:     'green',
  },
  {
    tip:      'teklif',
    baslik:   '📋 Fiyat Teklifi Mesajı',
    aciklama: 'WhatsApp üzerinden fiyat teklifi iletin',
    renk:     'blue',
  },
]

export default function WhatsAppModal({ kayit, onClose }) {
  const [tel, setTel] = useState(kayit?.telefon || '')

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`💬 WhatsApp Mesaj Şablonları — ${kayit?.musteri || '—'}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Üst bilgi */}
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Servis #{kayit?.id} · {cihazAd(kayit)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 truncate">
              Takip: {takipLink(kayit)}
            </p>
          </div>
        </div>

        {/* Şablonlar */}
        {SABLON_TANIMLARI.map(s => (
          <MesajKarti
            key={s.tip}
            tip={s.tip}
            baslik={s.baslik}
            aciklama={s.aciklama}
            renk={s.renk}
            kayit={kayit}
            tel={tel}
            onTelChange={setTel}
          />
        ))}

        <p className="text-xs text-gray-400 text-center">
          Mesaj metni doğrudan WhatsApp'ta açılır · Göndermeden önce düzenleyebilirsiniz
        </p>
      </div>
    </Modal>
  )
}
