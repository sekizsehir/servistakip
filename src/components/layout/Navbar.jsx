import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { path: '/', label: 'Servis', end: true },
  { path: '/cari', label: 'Cari' },
  { path: '/isler', label: 'İşler' },
  { path: '/kayitlar', label: 'Kayıtlar' },
  { path: '/stok', label: 'Stok' },
  { path: '/kampanya', label: 'Kampanya' },
]

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useApp()

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center h-14 px-6 gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-sm">
            G
          </div>
          <span className="font-bold text-gray-800 dark:text-white whitespace-nowrap text-[15px]">
            Servis Takip
          </span>
        </div>

        {/* Dikey ayraç */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 shrink-0" />

        {/* Nav linkleri */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Sağ bölüm */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Destek butonu */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-500 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Destek</span>
          </button>

          {/* Karanlık mod toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Karanlık mod"
          >
            {darkMode ? (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Kullanıcı adı */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              Admin
            </span>
          </div>

          {/* Dikey ayraç */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

          {/* Çıkış butonu */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  )
}
