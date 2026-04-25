import { useEffect, useState } from "react";
import axios from "axios";

export default function TambahStok() {
    const [open, setOpen] = useState(false)
    const [produk, setProduk] = useState([])
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if(open) {
            axios.get('http://localhost:3000/produk')
            .then(res => setProduk(res.data))
            .catch(err => console.error(err))
        }
    }, [open])

    return(
        <>
        {/* button +tambahstok */}
        <button 
        onClick={() => setOpen(true)}
        className="bg-green-600 text white px-4 py-2 rounded-lg cursor-pointer">
            + tambah stok
        </button>

        {/* modal tambahstok */}
        {open && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl w-96">
                    <h2 className="text-lg font-semibold mb-4">Pilih Produk</h2>

                    <div className="space-y-2 max-h-60 overflow-auto">
                        {produk.map((item) => (
                            <div key={item.id_produk}
                            onClick={() => setSelected(item)}
                            className={`p-2 border rounded cursor-pointer ${selected?.id_produk === item.id_produk ? "bg-green-100" : "" }`}>
                                {item.nama_produk}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setOpen(false)}>Batal</button>

                        <button disabled={!selected}
                        className="bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-400">Lanjut</button>
                    </div>
                </div>

            </div>
        )}
        </>
    )
}