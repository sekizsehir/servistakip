import Layout from '../components/layout/Layout'
import Card from '../components/shared/Card'
import { useApp } from '../context/AppContext'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function AyarlarPage() {
  const { darkMode, toggleDarkMode } = useApp()

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Firma Bilgileri */}
        <Card title="Firma Bilgileri">
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Firma Adı
              </label>
              <input
                type="text"
                defaultValue="Güven Elektronik Servisi"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Telefon
              </label>
              <input
                type="text"
                defaultValue=""
                placeholder="0(___) ___ __ __"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Adres
              </label>
              <textarea
                rows={2}
                defaultValue=""
                placeholder="Firma adresi..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Kaydet
            </button>
          </div>
        </Card>

        {/* Görünüm */}
        <Card title="Görünüm">
          <SettingRow
            label="Karanlık Mod"
            description="Arayüzü koyu renk temasına geçirir"
          >
            <Toggle checked={darkMode} onChange={toggleDarkMode} />
          </SettingRow>
        </Card>

        {/* Bildirimler */}
        <Card title="Bildirimler">
          <SettingRow
            label="Servis hatırlatmaları"
            description="Bekleyen servisler için günlük özet bildirimi"
          >
            <Toggle checked={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow
            label="WhatsApp bildirimleri"
            description="Müşteriye otomatik durum mesajı gönder"
          >
            <Toggle checked={false} onChange={() => {}} />
          </SettingRow>
        </Card>

        {/* Hakkında */}
        <Card title="Hakkında">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 py-1">
            <p>Servis Takip <span className="font-medium text-gray-700 dark:text-gray-300">v1.0.0</span></p>
            <p>Elektronik servis yönetim uygulaması</p>
          </div>
        </Card>

      </div>
    </Layout>
  )
}
