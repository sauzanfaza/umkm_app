import { useEffect, useState } from "react";
import axios from "axios";

export default function TambahStok({ onSuccess }) {
    const [open, setOpen] = useState(false)
    const [produk, setProduk] = useState([])
    const [selected, setSelected] = useState(null)

    const [step, setStep] = useState(1)
    const [stok, setStok] = useState("")

    useEffect(() => {
        if(open) {
            axios.get('http://localhost:3000/produk')
            .then(res => setProduk(res.data))
            .catch(err => console.error(err))
        }
    }, [open])

    return(
        <>
        {/* BUTTON */}
        <button 
            onClick={() => setOpen(true)}
            className="bg-[#004030] hover:bg-[#346739] text-white px-4 py-2 rounded-lg cursor-pointer"
        >
            + tambah stok
        </button>

        {/* MODAL */}
        {open && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl w-96">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">Pilih Produk</h2>

                            <div className="space-y-2 max-h-60 overflow-auto">
                                {produk.map((item) => (
                                    <div 
                                        key={item.id_produk}
                                        onClick={() => setSelected(item)}
                                        className={`p-2 border rounded cursor-pointer ${
                                            selected?.id_produk === item.id_produk
                                                ? "bg-green-100"
                                                : ""
                                        }`}
                                    >
                                        {item.nama_produk}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 mt-4 cursor-pointer">
                                <button onClick={() => setOpen(false)}>Batal</button>

                                <button 
                                    disabled={!selected}
                                    onClick={() => setStep(2)}
                                    className="bg-[#004030] hover:bg-[#346739] cursor-pointer text-white px-3 py-1 rounded disabled:bg-gray-400"
                                >
                                    Lanjut
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">Input Stok</h2>

                            <p className="mb-2 text-gray-600">
                                {selected?.nama_produk}
                            </p>

                            <input
                                type="number"
                                placeholder="Masukkan stok awal"
                                value={stok}
                                onChange={(e) => setStok(e.target.value)}
                                className="w-full p-2 border rounded"
                            />

                            <div className="flex justify-between mt-4 cursor-pointer">
                                <button onClick={() => setStep(1)}>
                                    Kembali
                                </button>

                                <button 
                                    disabled={!stok}
                                    className="bg-[#004030] hover:bg-[#346739] cursor-pointer text-white px-3 py-1 rounded disabled:bg-gray-400"
                                    onClick={async () => {
                                        try {
                                            await axios.post("http://localhost:3000/penjualan", {
                                                id_produk: selected.id_produk,
                                                stok_awal: stok
                                            })

                                            alert("Berhasil ditambahkan")

                                            if(onSuccess) onSuccess()

                                            // reset
                                            setOpen(false)
                                            setStep(1)
                                            setSelected(null)
                                            setStok("")
                                        } catch (err) {
                                            console.error(err)
                                            alert("Gagal simpan")
                                        }
                                    }}
                                >
                                    Simpan
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        )}
        </>
    )
}