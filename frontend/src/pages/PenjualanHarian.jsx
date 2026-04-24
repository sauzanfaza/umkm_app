import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/Navbar"

export default function PenjualanHarian() {
    return(
        <div className="flex">
                    {/* sidebar */}
                    <Sidebar />
        
                    {/* kanan: navbar + content */}
                    <div className="flex-1">
                        {/* Navbar */}
                        <Navbar />
        
                        {/* content */}
                        <div className="p-4">
                            Penjualan
                        </div>
                    </div>
                </div>
    )
}