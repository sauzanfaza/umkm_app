import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/Navbar"
import TambahStok from "../Components/TambahStok"

export default function PenjualanHarian() {
    return(
        <div className="flex">
                    {/* sidebar */}
                    <Sidebar />
        
                    {/* kanan: navbar + content */}
                    <div className="flex-1">
                        {/* Navbar */}
                        <Navbar>
                            <TambahStok />
                        </Navbar>
        
                        {/* content */}
                        <div className="h-screen overflow-hidden py-8 px-8 text-lg">
                            <div className="grid grid-cols-7 bg-slate-200 border border-slate-400 rounded-lg">
                                <div className="p-2 text-center">No</div>
                                <div className="p-2 text-center">Nama</div>
                                <div className="p-2 text-center">Harga</div>
                                <div className="p-2 text-center">Stok</div>
                                <div className="p-2 text-center">Stok Akhir</div>
                                <div className="p-2 text-center">Total</div>
                                <div className="p-2 text-center">Edit Stok</div>

                            </div>
                        </div>
                    </div>
                </div>
    )
}