import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { DataProvider } from './context/DataContext'
import ServisPage from './pages/ServisPage'
import CariPage from './pages/CariPage'
import IslerPage from './pages/IslerPage'
import KayitlarPage from './pages/KayitlarPage'
import StokPage from './pages/StokPage'
import KampanyaPage from './pages/KampanyaPage'
import AyarlarPage from './pages/AyarlarPage'
import TakipPage from './pages/TakipPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <DataProvider>
        <Routes>
          {/* Admin sayfalar */}
          <Route path="/" element={<ServisPage />} />
          <Route path="/cari" element={<CariPage />} />
          <Route path="/isler" element={<IslerPage />} />
          <Route path="/kayitlar" element={<KayitlarPage />} />
          <Route path="/stok" element={<StokPage />} />
          <Route path="/kampanya" element={<KampanyaPage />} />
          <Route path="/ayarlar" element={<AyarlarPage />} />

          {/* Public takip sayfası — admin layout yok */}
          <Route path="/takip" element={<TakipPage />} />
          <Route path="/takip/:servisNo" element={<TakipPage />} />
        </Routes>
        </DataProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
