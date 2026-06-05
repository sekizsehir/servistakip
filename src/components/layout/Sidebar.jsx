import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const menuItems = [
  { path: '/', label: 'Servis', icon: '🔧' },
  { path: '/cari', label: 'Cari', icon: '👥' },
  { path: '/isler', label: 'İşler', icon: '📋' },
  { path: '/kayitlar', label: 'Kayıtlar', icon: '📁' },
  { path: '/stok', label: 'Stok', icon: '📦' },
]

export default function Sidebar() {
  const { sidebarOpen } = useApp()

  return (
    <aside
      className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-56' : 'w-16'
      } min-h-screen shrink-0`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <span className="text-2xl">🛠️</span>
        {sidebarOpen && (
          <span className="font-bold text-amber-400 text-lg whitespace-nowrap">ServisTakip</span>
        )}
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700 text-xs text-gray-500">
        {sidebarOpen && <span>v1.0.0</span>}
      </div>
    </aside>
  )
}
