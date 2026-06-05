import { useMemo } from 'react'

/* ─── SVG ikonlar ─────────────────────────────────────────── */
const IconCalendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const IconWrench = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const IconClock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

/* ─── Kart tanımları ──────────────────────────────────────── */
const CARDS = [
  {
    key: 'randevu',
    label: 'RANDEVU',
    sub: 'randevu alındı',
    filter: s => s.durum === 'Randevu',
    gradient: 'from-violet-500 to-purple-700',
    glow: 'shadow-violet-300 dark:shadow-violet-900/60',
    ring: 'ring-violet-400/30',
    Icon: IconCalendar,
    anim: 'animate-float',
    shine: 'from-violet-400/20',
  },
  {
    key: 'tamir',
    label: 'TAMİRDE',
    sub: 'aktif tamir',
    filter: s => s.durum === 'Tamirde',
    gradient: 'from-orange-400 to-amber-600',
    glow: 'shadow-orange-300 dark:shadow-orange-900/60',
    ring: 'ring-orange-400/30',
    Icon: IconWrench,
    anim: 'animate-float-delay',
    shine: 'from-orange-300/20',
  },
  {
    key: 'hazir',
    label: 'HAZIR',
    sub: 'teslim bekliyor',
    filter: s => s.durum === 'Hazır' || s.durum === 'Teslim Edildi',
    gradient: 'from-emerald-400 to-green-600',
    glow: 'shadow-emerald-300 dark:shadow-emerald-900/60',
    ring: 'ring-emerald-400/30',
    Icon: IconCheck,
    anim: 'animate-float-slow',
    shine: 'from-green-300/20',
  },
  {
    key: 'beklemede',
    label: 'BEKLEMEDEKİLER',
    sub: 'sırada bekliyor',
    filter: s => s.durum === 'Beklemede',
    gradient: 'from-yellow-400 to-amber-400',
    glow: 'shadow-yellow-300 dark:shadow-yellow-900/60',
    ring: 'ring-yellow-400/30',
    Icon: IconClock,
    anim: 'animate-float-fast',
    shine: 'from-yellow-200/30',
  },
]

export default function StatCards({ kayitlar }) {
  const liste = kayitlar ?? []
  const counts = useMemo(
    () => CARDS.map(c => liste.filter(c.filter).length),
    [liste]
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card, i) => {
        const { label, sub, gradient, glow, ring, Icon, anim, shine } = card
        const count = counts[i]

        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg ${glow} ring-1 ${ring} cursor-default select-none`}
          >
            {/* Üst parıltı şeridi */}
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${shine} to-transparent`} />

            {/* Animasyonlu arka plan ikonu */}
            <div className={`absolute -right-4 -bottom-4 ${anim} pointer-events-none`}>
              <Icon className="w-28 h-28 text-white opacity-[0.12]" />
            </div>

            {/* İçerik */}
            <div className="relative z-10">
              <p className="text-[11px] font-bold tracking-widest text-white/70 uppercase mb-3">
                {label}
              </p>

              <p className="text-5xl font-black text-white leading-none tabular-nums drop-shadow-sm">
                {count}
              </p>

              <div className="mt-4 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60" />
                <p className="text-xs text-white/70 font-medium">{sub}</p>
              </div>
            </div>

            {/* Alt köşe küçük ikon */}
            <div className="absolute top-4 right-4">
              <Icon className="w-5 h-5 text-white/50" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
