import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Produk from './pages/Produk'
import PenjualanHarian from './pages/PenjualanHarian'
import ClosingHarian from './pages/ClosingHarian'
import Laporan from './pages/Laporan'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/produk' element={<Produk />} />
      <Route path='/penjualanHarian' element={<PenjualanHarian />} />
      <Route path='/closingHarian' element={<ClosingHarian />} />
      <Route path='/laporan' element={<Laporan />} />
    </Routes>
  )
}