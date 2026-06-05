import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Modal from '../components/shared/Modal'

/* ─── Sabitler ───────────────────────────────────────────── */
const LS_KEY = 'ikinciel_kayitlar'
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') ?? INIT } catch { return INIT } }
const save = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d))

const CIHAZ_TURLERI = ['Cep Telefonu','Laptop','Tablet','Akıllı Saat','Kulaklık','Bilgisayar','Oyun Konsolu','Diğer']
const MARKALAR = ['Apple','Samsung','Huawei','Xiaomi','Oppo','Google','Sony','Lenovo','Asus','HP','Dell','Diğer']
const ISLEM_TURLERI = ['Alındı','Satıldı','Depoda']
const HAFIZALAR = ['16 GB','32 GB','64 GB','128 GB','256 GB','512 GB','1 TB','Diğer']

const ISLEM_BADGE = {
  'Alındı':  'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Satıldı': 'bg-green-100  text-green-800  border-green-300  dark:bg-green-900/30  dark:text-green-300',
  'Depoda':  'bg-gray-100   text-gray-600   border-gray-300   dark:bg-gray-700      dark:text-gray-400',
}

const INIT = [
  { id:1, tarih:'2024-01-15', cihazTuru:'Cep Telefonu', marka:'Apple',   model:'iPhone 12',     renk:'Siyah',      hafiza:'128 GB', pil:85, imei:'353879105556442', islemTuru:'Depoda',  alisFiyati:8000,  satisFiyati:null,  satisKisi:null,     satisTarih:null,       kisi:'Mehmet Yılmaz', gorsel:null, not:'Küçük çizik' },
  { id:2, tarih:'2024-01-14', cihazTuru:'Cep Telefonu', marka:'Samsung', model:'Galaxy S21',    renk:'Gri',        hafiza:'256 GB', pil:92, imei:'358749102345678', islemTuru:'Satıldı', alisFiyati:6500,  satisFiyati:7800,  satisKisi:'Ali Veli',satisTarih:'2024-01-16',kisi:'Fatma Kaya',    gorsel:null, not:'' },
  { id:3, tarih:'2024-01-13', cihazTuru:'Tablet',       marka:'Apple',   model:'iPad Air 4',    renk:'Uzay Grisi', hafiza:'64 GB',  pil:78, imei:'DMPXT2KFKL5F',    islemTuru:'Alındı',  alisFiyati:9000,  satisFiyati:null,  satisKisi:null,     satisTarih:null,       kisi:'Tedarikçi AS', gorsel:null, not:'Temiz' },
  { id:4, tarih:'2024-01-12', cihazTuru:'Cep Telefonu', marka:'Apple',   model:'iPhone 13 Pro', renk:'Altın',      hafiza:'256 GB', pil:91, imei:'359271088888882', islemTuru:'Satıldı', alisFiyati:14000, satisFiyati:16500, satisKisi:'Zeynep', satisTarih:'2024-01-15',kisi:'Orhan Tekin',   gorsel:null, not:'' },
  { id:5, tarih:'2024-01-11', cihazTuru:'Laptop',       marka:'Apple',   model:'MacBook Air M2',renk:'Gece Yarısı',hafiza:'256 GB', pil:97, imei:'C02GH4K2MD6T',    islemTuru:'Depoda',  alisFiyati:32000, satisFiyati:null,  satisKisi:null,     satisTarih:null,       kisi:'Ahmet Aksoy',   gorsel:null, not:'Kutu dahil' },
]

const fmt = (v) => Math.abs(parseFloat(v)||0).toLocaleString('tr-TR')
const newId = () => Date.now() + Math.random()

/* ─── Döviz Kurları (simüle) ─────────────────────────────── */
const BASE = { USD:45.96, EUR:50.12, GRAM:2850, CEYREK:4620, GUMUS:34.50 }

function rand(base, pct=0.003) { return +(base*(1+(Math.random()-0.5)*pct)).toFixed(2) }

function KurSeridi() {
  const [kurlar, setKurlar] = useState(BASE)
  const [prev, setPrev] = useState(BASE)
  const [loading, setLoading] = useState(false)

  const yenile = async () => {
    setLoading(true)
    setPrev(kurlar)
    await new Promise(r => setTimeout(r, 700))
    setKurlar({ USD:rand(BASE.USD), EUR:rand(BASE.EUR), GRAM:rand(BASE.GRAM,0.005), CEYREK:rand(BASE.CEYREK,0.005), GUMUS:rand(BASE.GUMUS,0.004) })
    setLoading(false)
  }

  const trend = (k) => {
    const d = kurlar[k] - prev[k]
    return d > 0 ? '▲' : d < 0 ? '▼' : '─'
  }
  const trendCls = (k) => {
    const d = kurlar[k] - prev[k]
    return d > 0 ? 'text-green-600 dark:text-green-400' : d < 0 ? 'text-red-500' : 'text-gray-400'
  }

  const items = [
    { key:'USD', flag:'🇺🇸', label:'USD', val:`₺${fmt(kurlar.USD)}`, sub:'Amerikan Doları' },
    { key:'EUR', flag:'🇪🇺', label:'EUR', val:`₺${fmt(kurlar.EUR)}`, sub:'Euro' },
    { key:'GRAM',flag:'🥇',  label:'GRAM ALTIN', val:`₺${fmt(kurlar.GRAM)}`, sub:'Gram Altın' },
    { key:'CEYREK',flag:'💰',label:'ÇEYREK', val:`₺${fmt(kurlar.CEYREK)}`, sub:'Çeyrek Altın' },
    { key:'GUMUS',flag:'🥈', label:'GÜMÜŞ', val:`₺${kurlar.GUMUS.toFixed(2)}`, sub:'Gram Gümüş' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-3 overflow-x-auto shadow-sm">
      <div className="flex items-center gap-3 flex-1 min-w-max">
        {items.map(item => (
          <div key={item.key} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-base">{item.flag}</span>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-gray-700 dark:text-gray-200">{item.val}</span>
                <span className={`text-[10px] font-bold ${trendCls(item.key)}`}>{trend(item.key)}</span>
              </div>
              <p className="text-[10px] text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={yenile}
        disabled={loading}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500 hover:border-amber-300 cursor-pointer transition-colors disabled:animate-spin"
        title="Kurları yenile"
      >
        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <span className="text-[10px] text-gray-300 shrink-0">Gösterge kur</span>
    </div>
  )
}

/* ─── Hesap Makinesi (inline) ────────────────────────────── */
function Hesapla({ val, onClick, cls }) {
  return <button onClick={onClick} className={`rounded-xl h-11 text-sm font-semibold flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${cls}`}>{val}</button>
}
function HesapModal({ onClose }) {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [reset, setReset] = useState(false)
  const inp = (d) => { if (display==='0'||reset){setDisplay(String(d));setReset(false)}else if(display.length<12)setDisplay(display+d) }
  const dot = () => { if(reset){setDisplay('0.');setReset(false);return} if(!display.includes('.'))setDisplay(display+'.') }
  const operator = (o) => { setPrev(parseFloat(display));setOp(o);setReset(true) }
  const calc = () => {
    if(prev===null||op===null)return
    const cur=parseFloat(display)
    const ops={'+':{v:prev+cur},'-':{v:prev-cur},'×':{v:prev*cur},'÷':{v:cur!==0?prev/cur:0}}
    const r=ops[op]?.v??0
    setDisplay(String(parseFloat(r.toFixed(8))));setPrev(null);setOp(null);setReset(true)
  }
  const clear = () => { setDisplay('0');setPrev(null);setOp(null);setReset(false) }
  const b='bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
  const f='bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white'
  const o='bg-amber-400 hover:bg-amber-500 text-white'
  return (
    <Modal isOpen onClose={onClose} title="Hesap Makinesi" size="sm">
      <div className="w-64 mx-auto select-none">
        <div className="bg-gray-800 dark:bg-gray-950 rounded-xl p-4 mb-3 text-right">
          {op&&<div className="text-gray-400 text-xs mb-1">{prev} {op}</div>}
          <div className="text-white text-3xl font-light truncate">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Hesapla val="C" onClick={clear} cls={f}/>
          <Hesapla val="±" onClick={()=>setDisplay(String(-parseFloat(display)))} cls={f}/>
          <Hesapla val="%" onClick={()=>setDisplay(String(parseFloat(display)/100))} cls={f}/>
          <Hesapla val="÷" onClick={()=>operator('÷')} cls={o}/>
          {[7,8,9].map(n=><Hesapla key={n} val={n} onClick={()=>inp(n)} cls={b}/>)}
          <Hesapla val="×" onClick={()=>operator('×')} cls={o}/>
          {[4,5,6].map(n=><Hesapla key={n} val={n} onClick={()=>inp(n)} cls={b}/>)}
          <Hesapla val="-" onClick={()=>operator('-')} cls={o}/>
          {[1,2,3].map(n=><Hesapla key={n} val={n} onClick={()=>inp(n)} cls={b}/>)}
          <Hesapla val="+" onClick={()=>operator('+')} cls={o}/>
          <Hesapla val="0" onClick={()=>inp(0)} cls={`col-span-2 ${b}`}/>
          <Hesapla val="." onClick={dot} cls={b}/>
          <Hesapla val="=" onClick={calc} cls="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 text-sm font-semibold flex items-center justify-center cursor-pointer"/>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Özet Modal ─────────────────────────────────────────── */
function OzetModal({ kayitlar, onClose }) {
  const alisTop  = kayitlar.reduce((s,k)=>s+(k.alisFiyati||0),0)
  const satisTop = kayitlar.filter(k=>k.islemTuru==='Satıldı').reduce((s,k)=>s+(k.satisFiyati||0),0)
  const depodaTop= kayitlar.filter(k=>k.islemTuru==='Depoda').reduce((s,k)=>s+(k.alisFiyati||0),0)
  const kar      = satisTop - kayitlar.filter(k=>k.islemTuru==='Satıldı').reduce((s,k)=>s+(k.alisFiyati||0),0)

  const markaStats = kayitlar.reduce((acc,k)=>{
    if(!acc[k.marka])acc[k.marka]={adet:0,kar:0}
    acc[k.marka].adet++
    if(k.islemTuru==='Satıldı')acc[k.marka].kar+=(k.satisFiyati||0)-(k.alisFiyati||0)
    return acc
  },{})

  return (
    <Modal isOpen onClose={onClose} title="📊 Finansal Özet" size="md">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { l:'Toplam Kayıt',    v:kayitlar.length,                    cls:'text-gray-800 dark:text-white' },
            { l:'Depodaki Cihaz',  v:kayitlar.filter(k=>k.islemTuru==='Depoda').length,  cls:'text-gray-600' },
            { l:'Toplam Alış',     v:`₺${fmt(alisTop)}`,                  cls:'text-red-500' },
            { l:'Toplam Satış',    v:`₺${fmt(satisTop)}`,                 cls:'text-green-500' },
            { l:'Depoda Değer',    v:`₺${fmt(depodaTop)}`,                cls:'text-amber-600' },
            { l:'Brüt Kâr',        v:`₺${fmt(kar)}`,                      cls:kar>=0?'text-green-600':'text-red-500' },
          ].map(s=>(
            <div key={s.l} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">{s.l}</p>
              <p className={`text-lg font-black ${s.cls}`}>{s.v}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Marka Dağılımı</p>
          <div className="space-y-1.5">
            {Object.entries(markaStats).sort((a,b)=>b[1].adet-a[1].adet).map(([marka,stat])=>(
              <div key={marka} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{marka}</span>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span>{stat.adet} cihaz</span>
                  {stat.kar!==0&&<span className={stat.kar>0?'text-green-500':'text-red-500'}>₺{fmt(stat.kar)} kâr</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Cihaz Form Modal ───────────────────────────────────── */
const EMPTY_FORM = { cihazTuru:'Cep Telefonu',marka:'Apple',model:'',renk:'',hafiza:'128 GB',pil:'',imei:'',islemTuru:'Alındı',alisFiyati:'',kisi:'',gorsel:null,gorselUrl:null,not:'' }

function CihazModal({ kayit, onSave, onClose }) {
  const [frm, setFrm] = useState(kayit ? { ...kayit, pil:String(kayit.pil||''), alisFiyati:String(kayit.alisFiyati||''), gorsel:null, gorselUrl:kayit.gorselUrl||null } : EMPTY_FORM)
  const fileRef = useRef(null)
  const set = (k,v) => setFrm(f=>({...f,[k]:v}))

  const handleGorsel = (file) => {
    if(!file)return
    const url = URL.createObjectURL(file)
    setFrm(f=>({...f,gorsel:file,gorselUrl:url}))
  }

  const inp = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition`

  return (
    <Modal isOpen onClose={onClose} title={kayit ? '✏️ Cihaz Düzenle' : '➕ Cihaz Ekle'} size="lg">
      <div className="space-y-4">
        {/* Cihaz türü + marka */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Cihaz Türü *</label>
            <select value={frm.cihazTuru} onChange={e=>set('cihazTuru',e.target.value)} className={inp}>
              {CIHAZ_TURLERI.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Marka *</label>
            <select value={frm.marka} onChange={e=>set('marka',e.target.value)} className={inp}>
              {MARKALAR.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Model *</label>
            <input type="text" placeholder="iPhone 14 Pro..." value={frm.model} onChange={e=>set('model',e.target.value)} className={inp}/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">İşlem Türü</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {ISLEM_TURLERI.map(t=>(
                <button key={t} onClick={()=>set('islemTuru',t)}
                  className={`flex-1 py-2 text-xs font-semibold cursor-pointer transition-colors ${frm.islemTuru===t
                    ? t==='Alındı'?'bg-yellow-400 text-yellow-900':t==='Satıldı'?'bg-green-500 text-white':'bg-gray-400 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50'}`}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Renk</label>
            <input type="text" placeholder="Siyah, Beyaz..." value={frm.renk} onChange={e=>set('renk',e.target.value)} className={inp}/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Hafıza</label>
            <select value={frm.hafiza} onChange={e=>set('hafiza',e.target.value)} className={inp}>
              {HAFIZALAR.map(h=><option key={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Pil Sağlığı (%)</label>
            <div className="relative">
              <input type="number" min="0" max="100" placeholder="85" value={frm.pil} onChange={e=>set('pil',e.target.value)} className={inp+' pr-7'}/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
            </div>
            {frm.pil && <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${frm.pil>=80?'bg-green-500':frm.pil>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${Math.min(100,frm.pil)}%`}}/></div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">IMEI / Seri No</label>
            <input type="text" placeholder="15 haneli IMEI..." value={frm.imei} onChange={e=>set('imei',e.target.value)} className={inp}/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Alış Fiyatı (₺) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
              <input type="number" min="0" placeholder="0" value={frm.alisFiyati} onChange={e=>set('alisFiyati',e.target.value)} className={inp+' pl-7'}/>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Kişi / Firma</label>
          <input type="text" placeholder="Alındığı kişi veya firma..." value={frm.kisi} onChange={e=>set('kisi',e.target.value)} className={inp}/>
        </div>
        {/* Görsel */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Cihaz Görseli</label>
          <div
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-amber-300 transition-colors"
            onClick={()=>fileRef.current?.click()}
            onDrop={e=>{e.preventDefault();handleGorsel(e.dataTransfer.files[0])}}
            onDragOver={e=>e.preventDefault()}
          >
            {frm.gorselUrl ? (
              <div className="relative inline-block">
                <img src={frm.gorselUrl} alt="" className="max-h-32 mx-auto rounded-lg object-contain"/>
                <button type="button" onClick={e=>{e.stopPropagation();setFrm(f=>({...f,gorsel:null,gorselUrl:null}))}} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
              </div>
            ) : (
              <div className="py-2">
                <div className="text-2xl mb-1">📷</div>
                <p className="text-xs text-gray-400">Sürükle & bırak veya <span className="text-amber-500 font-medium">seç</span></p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>handleGorsel(e.target.files[0])}/>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Not</label>
          <textarea rows={2} placeholder="Cihaz durumu, kusurlar..." value={frm.not} onChange={e=>set('not',e.target.value)} className={inp+' resize-none'}/>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={()=>onSave(frm)} disabled={!frm.model.trim()||!frm.alisFiyati}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer disabled:opacity-40 transition-colors">
            {kayit ? '✓ Güncelle' : '✓ Kaydet'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">İptal</button>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Sat Modal ──────────────────────────────────────────── */
function SatModal({ kayit, onSat, onClose }) {
  const [fiyat, setFiyat] = useState('')
  const [kisi, setKisi]   = useState('')
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])
  const kar = (parseFloat(fiyat)||0) - (kayit.alisFiyati||0)
  const inp = `w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300`
  return (
    <Modal isOpen onClose={onClose} title={`📤 Sat — ${kayit.marka} ${kayit.model}`} size="sm">
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
          <p className="text-xs text-gray-400">Alış Fiyatı</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">₺{fmt(kayit.alisFiyati)}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Satış Fiyatı (₺) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
            <input type="number" min="0" placeholder="0" value={fiyat} onChange={e=>setFiyat(e.target.value)} className={inp+' pl-7'} autoFocus/>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Alıcı Kişi / Firma</label>
          <input type="text" placeholder="Müşteri adı..." value={kisi} onChange={e=>setKisi(e.target.value)} className={inp}/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Satış Tarihi</label>
          <input type="date" value={tarih} onChange={e=>setTarih(e.target.value)} className={inp}/>
        </div>
        {fiyat && (
          <div className={`rounded-xl p-3 text-center ${kar>=0?'bg-green-50 dark:bg-green-900/20':'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-xs text-gray-400">Kâr / Zarar</p>
            <p className={`text-2xl font-black ${kar>=0?'text-green-600':'text-red-500'}`}>
              {kar>=0?'+':'-'}₺{fmt(kar)}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={()=>onSat({satisFiyati:parseFloat(fiyat),satisKisi:kisi,satisTarih:tarih})} disabled={!fiyat}
            className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm cursor-pointer disabled:opacity-40 transition-colors">
            ✓ Satışı Kaydet
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-sm cursor-pointer hover:bg-gray-50">İptal</button>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Yazdır ─────────────────────────────────────────────── */
function printListe(kayitlar) {
  const satirlar = kayitlar.map(k=>`
    <tr>
      <td>${k.id}</td><td>${k.tarih}</td><td>${k.marka} ${k.model}</td>
      <td>${k.renk||'—'} / ${k.hafiza||'—'}</td><td>${k.pil?k.pil+'%':'—'}</td>
      <td style="font-family:monospace;font-size:11px">${k.imei||'—'}</td>
      <td><span style="padding:2px 8px;border-radius:12px;font-size:11px;font-weight:bold;background:${k.islemTuru==='Satıldı'?'#dcfce7':k.islemTuru==='Alındı'?'#fef9c3':'#f3f4f6'}">${k.islemTuru}</span></td>
      <td style="text-align:right">₺${fmt(k.alisFiyati)}</td>
      <td style="text-align:right;color:${k.satisFiyati?'#16a34a':'#9ca3af'}">${k.satisFiyati?'₺'+fmt(k.satisFiyati):'—'}</td>
      <td>${k.kisi||'—'}</td>
    </tr>`).join('')
  const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>İkinci El Kayıtları</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;padding:24px}
  h1{font-size:16px;font-weight:900;color:#f59e0b;margin-bottom:4px}p{color:#9ca3af;font-size:11px;margin-bottom:16px}
  table{width:100%;border-collapse:collapse}th{background:#1f2937;color:white;padding:8px 10px;text-align:left;font-size:11px}
  td{padding:6px 10px;border-bottom:1px solid #f3f4f6;font-size:11px}tr:nth-child(even)td{background:#f9fafb}
  @media print{body{padding:10px}}</style></head>
  <body><h1>G Servis Takip — İkinci El Kayıtları</h1>
  <p>${new Date().toLocaleDateString('tr-TR')} · Toplam ${kayitlar.length} kayıt</p>
  <table><thead><tr><th>#</th><th>Tarih</th><th>Cihaz</th><th>Renk/Hafıza</th><th>Pil</th><th>IMEI</th><th>İşlem</th><th>Alış</th><th>Satış</th><th>Kişi</th></tr></thead>
  <tbody>${satirlar}</tbody></table>
  <script>window.onload=()=>window.print()</script></body></html>`
  const w=window.open('','_blank','width=1000,height=700')
  if(w){w.document.write(html);w.document.close()}
}

/* ─── Ana Sayfa ──────────────────────────────────────────── */
export default function KayitlarPage() {
  const [kayitlar, setKayitlar] = useState(load)
  const [arama,    setArama]    = useState('')
  const [filtreTur, setFiltreTur] = useState('Tüm İşlemler')
  const [filtreMarka, setFiltreMarka] = useState('Tüm Markalar')
  const [filtreCihaz, setFiltreCihaz] = useState('Tüm Türler')

  const [cihazModal, setCihazModal] = useState(false)
  const [duzenleKayit, setDuzenleKayit] = useState(null)
  const [satModal, setSatModal]     = useState(null)
  const [hesapModal, setHesapModal] = useState(false)
  const [ozetModal, setOzetModal]   = useState(false)

  const upd = useCallback((fn) => setKayitlar(prev => { const n = typeof fn==='function'?fn(prev):fn; save(n); return n }), [])

  const cihazEkle = (frm) => {
    const yeni = { id:newId(), tarih:new Date().toISOString().split('T')[0], ...frm, alisFiyati:parseFloat(frm.alisFiyati)||0, pil:parseFloat(frm.pil)||null, satisFiyati:null, satisKisi:null, satisTarih:null }
    upd(prev => [yeni, ...prev])
    setCihazModal(false)
  }

  const cihazGuncelle = (frm) => {
    upd(prev => prev.map(k => k.id===duzenleKayit.id ? { ...k, ...frm, alisFiyati:parseFloat(frm.alisFiyati)||0, pil:parseFloat(frm.pil)||null } : k))
    setDuzenleKayit(null)
  }

  const kayitSil = (id) => {
    if (!window.confirm('Bu kayıt silinsin mi?')) return
    upd(prev => prev.filter(k => k.id !== id))
  }

  const sat = (kayitId, satData) => {
    upd(prev => prev.map(k => k.id===kayitId ? { ...k, islemTuru:'Satıldı', ...satData } : k))
    setSatModal(null)
  }

  const goruntulenen = useMemo(() => {
    let d = [...kayitlar]
    if (arama.trim()) {
      const q = arama.toLowerCase()
      d = d.filter(k => `${k.marka} ${k.model} ${k.imei||''}`.toLowerCase().includes(q))
    }
    if (filtreTur !== 'Tüm İşlemler') d = d.filter(k => k.islemTuru === filtreTur)
    if (filtreMarka !== 'Tüm Markalar') d = d.filter(k => k.marka === filtreMarka)
    if (filtreCihaz !== 'Tüm Türler') d = d.filter(k => k.cihazTuru === filtreCihaz)
    return d
  }, [kayitlar, arama, filtreTur, filtreMarka, filtreCihaz])

  const selectCls = `border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer`

  return (
    <Layout>
      <div className="space-y-4">

        {/* Kur Seridi */}
        <KurSeridi />

        {/* Üst Butonlar */}
        <div className="flex flex-wrap gap-2">
          {[
            { label:'+ Cihaz Ekle', onClick:()=>setCihazModal(true),  cls:'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' },
            { label:'🧮 Hesap',     onClick:()=>setHesapModal(true),  cls:'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600' },
            { label:'🖨️ Yazdır',   onClick:()=>printListe(goruntulenen), cls:'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600' },
            { label:'📊 Özet',     onClick:()=>setOzetModal(true),    cls:'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600' },
          ].map(b => (
            <button key={b.label} onClick={b.onClick}
              className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${b.cls}`}>{b.label}
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-400 self-center">{goruntulenen.length} / {kayitlar.length} kayıt</div>
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Marka, Model, IMEI ara..."
              value={arama} onChange={e=>setArama(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {arama && <button onClick={()=>setArama('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none">×</button>}
          </div>
          <select value={filtreTur} onChange={e=>setFiltreTur(e.target.value)} className={selectCls}>
            <option>Tüm İşlemler</option>
            {ISLEM_TURLERI.map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={filtreMarka} onChange={e=>setFiltreMarka(e.target.value)} className={selectCls}>
            <option>Tüm Markalar</option>
            {[...new Set(kayitlar.map(k=>k.marka))].sort().map(m=><option key={m}>{m}</option>)}
          </select>
          <select value={filtreCihaz} onChange={e=>setFiltreCihaz(e.target.value)} className={selectCls}>
            <option>Tüm Türler</option>
            {[...new Set(kayitlar.map(k=>k.cihazTuru))].sort().map(t=><option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Tablo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{minWidth:'1000px'}}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                  {['#','GÖRSEL','TARİH','CİHAZ','RENK / HAFIZA','PİL','IMEI','İŞLEM','FİYAT','KİŞİ / FİRMA','İŞLEM'].map((h,i) => (
                    <th key={i} className="px-3 py-2.5 text-left font-bold text-gray-500 dark:text-gray-400 tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {goruntulenen.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-12 text-gray-400">
                    <div className="text-3xl mb-2">📦</div>
                    <p>Kayıt bulunamadı</p>
                  </td></tr>
                ) : goruntulenen.map((k,i) => {
                  const kar = k.satisFiyati ? k.satisFiyati - k.alisFiyati : null
                  return (
                    <tr key={k.id} className={`border-b border-gray-50 dark:border-gray-700/50 hover:bg-amber-50/20 dark:hover:bg-amber-900/5 transition-colors ${i%2!==0?'bg-gray-50/30 dark:bg-gray-800/20':''}`}>
                      {/* # */}
                      <td className="px-3 py-2.5 text-gray-400 font-mono">{i+1}</td>
                      {/* Görsel */}
                      <td className="px-3 py-2.5">
                        {k.gorselUrl
                          ? <img src={k.gorselUrl} alt="" className="w-9 h-9 rounded-lg object-cover"/>
                          : <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-base">
                              {k.cihazTuru==='Cep Telefonu'?'📱':k.cihazTuru==='Laptop'?'💻':k.cihazTuru==='Tablet'?'📱':'🔧'}
                            </div>
                        }
                      </td>
                      {/* Tarih */}
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{k.tarih}</td>
                      {/* Cihaz */}
                      <td className="px-3 py-2.5">
                        <p className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">{k.marka} {k.model}</p>
                        <p className="text-gray-400 text-[10px]">{k.cihazTuru}</p>
                      </td>
                      {/* Renk/Hafıza */}
                      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <div>{k.renk||'—'}</div>
                        <div className="text-gray-400">{k.hafiza||'—'}</div>
                      </td>
                      {/* Pil */}
                      <td className="px-3 py-2.5">
                        {k.pil ? (
                          <>
                            <span className={`font-semibold ${k.pil>=80?'text-green-500':k.pil>=50?'text-amber-500':'text-red-500'}`}>{k.pil}%</span>
                            <div className="w-12 h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                              <div className={`h-full rounded-full ${k.pil>=80?'bg-green-500':k.pil>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${k.pil}%`}}/>
                            </div>
                          </>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      {/* IMEI */}
                      <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">{k.imei||'—'}</td>
                      {/* İşlem badge */}
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${ISLEM_BADGE[k.islemTuru]}`}>
                          {k.islemTuru}
                        </span>
                      </td>
                      {/* Fiyat */}
                      <td className="px-3 py-2.5">
                        <p className="font-bold text-gray-800 dark:text-white whitespace-nowrap">₺{fmt(k.alisFiyati)}</p>
                        {k.satisFiyati && (
                          <>
                            <p className="text-green-500 font-semibold">→ ₺{fmt(k.satisFiyati)}</p>
                            <p className={`text-[10px] font-bold ${kar>=0?'text-green-400':'text-red-400'}`}>{kar>=0?'+':'-'}₺{fmt(kar)}</p>
                          </>
                        )}
                      </td>
                      {/* Kişi */}
                      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 max-w-28">
                        <p className="truncate">{k.kisi||'—'}</p>
                        {k.satisKisi && <p className="text-green-500 text-[10px] truncate">→ {k.satisKisi}</p>}
                      </td>
                      {/* İşlem butonları */}
                      <td className="px-3 py-2.5">
                        <div className="flex gap-0.5">
                          {k.islemTuru !== 'Satıldı' && (
                            <button title="Sat" onClick={()=>setSatModal(k)}
                              className="px-2 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 cursor-pointer text-[10px] font-bold transition-colors">
                              Sat
                            </button>
                          )}
                          <button title="Düzenle" onClick={()=>setDuzenleKayit(k)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-amber-500 cursor-pointer transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button title="Yazdır" onClick={()=>printListe([k])}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 cursor-pointer transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                            </svg>
                          </button>
                          <button title="Sil" onClick={()=>kayitSil(k.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 cursor-pointer transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {goruntulenen.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-400">
              <span>Toplam alış: <strong className="text-red-500">₺{fmt(goruntulenen.reduce((s,k)=>s+(k.alisFiyati||0),0))}</strong></span>
              <span>Toplam satış: <strong className="text-green-500">₺{fmt(goruntulenen.filter(k=>k.satisFiyati).reduce((s,k)=>s+(k.satisFiyati||0),0))}</strong></span>
              <span>Depoda: <strong className="text-amber-600">{goruntulenen.filter(k=>k.islemTuru==='Depoda').length} cihaz</strong></span>
            </div>
          )}
        </div>
      </div>

      {cihazModal  && <CihazModal onSave={cihazEkle}  onClose={()=>setCihazModal(false)}/>}
      {duzenleKayit&& <CihazModal kayit={duzenleKayit} onSave={cihazGuncelle} onClose={()=>setDuzenleKayit(null)}/>}
      {satModal    && <SatModal kayit={satModal} onSat={(d)=>sat(satModal.id,d)} onClose={()=>setSatModal(null)}/>}
      {hesapModal  && <HesapModal onClose={()=>setHesapModal(false)}/>}
      {ozetModal   && <OzetModal kayitlar={kayitlar} onClose={()=>setOzetModal(false)}/>}
    </Layout>
  )
}
