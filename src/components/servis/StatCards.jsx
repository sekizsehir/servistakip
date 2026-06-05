import { useMemo } from 'react'

const CARDS = [
  {
    key: 'randevu',
    label: 'RANDEVU',
    filter: s => s.durum === 'Randevu',
    color: 'violet',
    border: 'border-l-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/10',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'tamir',
    label: 'TAMİRDE',
    filter: s => s.durum === 'Tamirde',
    color: 'orange',
    border: 'border-l-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'hazir',
    label: 'HAZIR',
    filter: s => s.durum === 'Hazır' || s.durum === 'Teslim Edildi',
    color: 'green',
    border: 'border-l-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    key: 'beklemede',
    label: 'BEKLEMEDEKİLER',
    filter: s => s.durum === 'Beklemede',
    color: 'yellow',
    border: 'border-l-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function StatCards({ kayitlar }) {
  const liste = kayitlar ?? []
  const counts = useMemo(
    () => CARDS.map(c => liste.filter(c.filter).length),
    [liste]
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map((card, i) => (
        <div
          key={card.key}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 border-l-4 ${card.border} shadow-sm p-5 relative overflow-hidden`}
        >
          {/* Faded arka plan ikonu */}
          <div className="absolute right-3 top-3 w-16 h-16 opacity-[0.07]">
            {card.icon}
          </div>

          {/* Sayı */}
          <p className="text-5xl font-black text-gray-800 dark:text-white leading-none">
            {counts[i]}
          </p>

          {/* Etiket */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${card.bg} ${card.text}`}>
              {card.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
