import { Link } from "react-router-dom"
import { LuLayoutDashboard } from "react-icons/lu";
import { LuCakeSlice } from "react-icons/lu";
import { LuClipboardList } from "react-icons/lu";
import { GoChecklist } from "react-icons/go";
import { FaRegCalendarCheck } from "react-icons/fa";


export default function Sidebar() {

    const menuClass = "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#346739] text-xl font-semibold"
    
      return (
        <>
        <aside className="flex flex-col w-64 min-h-screen bg-[#004030] text-white p-4">
            <div className="text-center font-semibold mb-18 mt-10">
                <h1>Toko Kue Bu Imas</h1>
            </div>
            
            <nav className="space-y-4">
                <Link to="/" className={menuClass}><LuLayoutDashboard /> Dashboard</Link>
                <Link to="/produk" className={menuClass}><LuCakeSlice /> Produk</Link>
                <Link to="/penjualanHarian" className={menuClass}><LuClipboardList /> Penjualan Harian</Link>
                <Link to="/closingHarian" className={menuClass}><FaRegCalendarCheck />Closing Harian</Link>
                <Link to="/laporan" className={menuClass}><GoChecklist /> Laporan</Link>
            </nav>
        </aside>
        </>
    )
}