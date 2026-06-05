import { useState, useEffect, useRef, useCallback } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

/* ─── Hesap Makinesi ─────────────────────────────────────── */
function Hesapla({ val, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl h-12 text-sm font-semibold flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${className}`}
    >
      {val}
    </button>
  )
}

function HesapMakinesi() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [reset, setReset] = useState(false)

  const input = (digit) => {
    if (display === '0' || reset) { setDisplay(String(digit)); setReset(false) }
    else if (display.length < 12) setDisplay(display + digit)
  }

  const dot = () => {
    if (reset) { setDisplay('0.'); setReset(false); return }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  const operator = (o) => {
    setPrev(parseFloat(display))
    setOp(o)
    setReset(true)
  }

  const calc = () => {
    if (prev === null || op === null) return
    const cur = parseFloat(display)
    const ops = { '+': prev + cur, '-': prev - cur, '×': prev * cur, '÷': prev / cur }
    const result = ops[op]
    setDisplay(isFinite(result) ? String(parseFloat(result.toFixed(8))) : 'Hata')
    setPrev(null); setOp(null); setReset(true)
  }

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setReset(false) }
  const negate = () => setDisplay(String(-parseFloat(display)))
  const percent = () => setDisplay(String(parseFloat(display) / 100))

  const btn = 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
  const fnBtn = 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white'
  const opBtn = 'bg-amber-400 hover:bg-amber-500 text-white'
  const eqBtn = 'bg-amber-500 hover:bg-amber-600 text-white'

  return (
    <div className="w-64 select-none">
      <div className="bg-gray-800 dark:bg-gray-950 rounded-xl p-4 mb-3 text-right">
        {op && <div className="text-gray-400 text-xs mb-1">{prev} {op}</div>}
        <div className="text-white text-3xl font-light truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Hesapla val="C" onClick={clear} className={`${fnBtn}`} />
        <Hesapla val="±" onClick={negate} className={`${fnBtn}`} />
        <Hesapla val="%" onClick={percent} className={`${fnBtn}`} />
        <Hesapla val="÷" onClick={() => operator('÷')} className={`${opBtn}`} />

        {[7,8,9].map(n => <Hesapla key={n} val={n} onClick={() => input(n)} className={btn} />)}
        <Hesapla val="×" onClick={() => operator('×')} className={`${opBtn}`} />

        {[4,5,6].map(n => <Hesapla key={n} val={n} onClick={() => input(n)} className={btn} />)}
        <Hesapla val="-" onClick={() => operator('-')} className={`${opBtn}`} />

        {[1,2,3].map(n => <Hesapla key={n} val={n} onClick={() => input(n)} className={btn} />)}
        <Hesapla val="+" onClick={() => operator('+')} className={`${opBtn}`} />

        <Hesapla val="0" onClick={() => input(0)} className={`col-span-2 ${btn}`} />
        <Hesapla val="." onClick={dot} className={btn} />
        <Hesapla val="=" onClick={calc} className={`${eqBtn}`} />
      </div>
    </div>
  )
}

/* ─── Not Defteri ────────────────────────────────────────── */
function NotDefteri() {
  const [text, setText] = useState(() => localStorage.getItem('notDefteri') || '')

  const save = useCallback((val) => {
    setText(val)
    localStorage.setItem('notDefteri', val)
  }, [])

  return (
    <div className="space-y-2">
      <textarea
        className="w-full h-64 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white dark:bg-gray-800 dark:text-white"
        placeholder="Notlarınızı buraya yazın..."
        value={text}
        onChange={e => save(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Otomatik kaydediliyor</span>
        <button
          onClick={() => save('')}
          className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
        >
          Temizle
        </button>
      </div>
    </div>
  )
}

/* ─── WhatsApp Direkt ────────────────────────────────────── */
function WhatsAppDirekt() {
  const [tel, setTel] = useState('')
  const [mesaj, setMesaj] = useState('')

  const link = () => {
    const no = tel.replace(/\D/g, '')
    const tam = no.startsWith('90') ? no : `90${no.replace(/^0/, '')}`
    const url = `https://wa.me/${tam}${mesaj ? `?text=${encodeURIComponent(mesaj)}` : ''}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Telefon Numarası
        </label>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">
            🇹🇷 +90
          </span>
          <input
            type="tel"
            placeholder="5xx xxx xx xx"
            value={tel}
            onChange={e => setTel(e.target.value)}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mesaj (isteğe bağlı)
        </label>
        <textarea
          placeholder="Merhaba, servisiniz hakkında..."
          value={mesaj}
          onChange={e => setMesaj(e.target.value)}
          rows={4}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white dark:bg-gray-800 dark:text-white"
        />
      </div>
      <Button
        onClick={link}
        disabled={!tel}
        className="w-full justify-center"
        style={{ backgroundColor: '#25d366', borderColor: '#25d366' }}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp'ta Aç
      </Button>
    </div>
  )
}

/* ─── e-Fatura Yönetimi ──────────────────────────────────── */
function EFatura() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
        ⚠️ Bu modül entegrasyon gerektirmektedir. GİB e-Fatura API bağlantısı yapıldıktan sonra aktif olacaktır.
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['e-Fatura Oluştur', 'e-Arşiv Fatura', 'Gönderilen Faturalar', 'Gelen Faturalar'].map(item => (
          <button key={item} disabled className="border border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center text-sm text-gray-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Ana Bileşen ─────────────────────────────────────────── */
const MODALS = { hesap: false, not: false, wa: false, efatura: false }

export default function QuickActions() {
  const [modals, setModals] = useState(MODALS)
  const [copied, setCopied] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [pwaInstalled, setPwaInstalled] = useState(false)

  const open = (key) => setModals(m => ({ ...m, [key]: true }))
  const close = (key) => setModals(m => ({ ...m, [key]: false }))

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setPwaInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstallPrompt(null); setPwaInstalled(true) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleTakip = () => {
    window.open(`${window.location.origin}/takip`, '_blank', 'noopener')
  }

  const btnBase = 'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border whitespace-nowrap'
  const btnStyle = `${btnBase} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-sm`

  const actions = [
    {
      label: 'Hesap Makinesi',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
        </svg>
      ),
      onClick: () => open('hesap'),
    },
    {
      label: 'Not Defteri',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => open('not'),
    },
    {
      label: pwaInstalled ? 'Yüklendi ✓' : 'Uygulamayı Yükle',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      onClick: handleInstall,
      disabled: pwaInstalled || !installPrompt,
      title: !installPrompt && !pwaInstalled ? 'Tarayıcınız PWA desteklemiyor veya uygulama zaten yüklü' : undefined,
    },
    {
      label: 'WhatsApp Direkt',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      onClick: () => open('wa'),
      className: 'hover:border-green-400 hover:text-green-600',
    },
    {
      label: 'e-Fatura Yönetimi',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => open('efatura'),
    },
    {
      label: 'Servis Takip',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      onClick: handleTakip,
    },
    {
      label: copied ? 'Kopyalandı!' : 'Linki Kopyala',
      icon: copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: handleCopy,
      className: copied ? 'border-green-400 text-green-600 bg-green-50 dark:bg-green-900/20' : '',
    },
  ]

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            disabled={a.disabled}
            title={a.title}
            className={`${btnStyle} ${a.className ?? ''} ${a.disabled ? 'opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-700 hover:shadow-none' : ''}`}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>

      <Modal isOpen={modals.hesap} onClose={() => close('hesap')} title="Hesap Makinesi" size="sm">
        <div className="flex justify-center">
          <HesapMakinesi />
        </div>
      </Modal>

      <Modal isOpen={modals.not} onClose={() => close('not')} title="Not Defteri" size="md">
        <NotDefteri />
      </Modal>

      <Modal isOpen={modals.wa} onClose={() => close('wa')} title="WhatsApp Direkt Mesaj" size="md">
        <WhatsAppDirekt />
      </Modal>

      <Modal isOpen={modals.efatura} onClose={() => close('efatura')} title="e-Fatura Yönetimi" size="md">
        <EFatura />
      </Modal>
    </>
  )
}
