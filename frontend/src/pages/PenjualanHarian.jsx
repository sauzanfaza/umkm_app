import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/Navbar"
import TambahStok from "../Components/TambahStok"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function PenjualanHarian() {
    const [data, setData] = useState([])
    const [editItem, setEditItem] = useState(null)
    const [newStokAwal, setNewStokAwal] = useState("")
    const [tanggal, setTanggal] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const prevValuesRef = useRef({})

    const getData = async () => {
        const res = await axios.get("http://localhost:3000/penjualan")
        setData(res.data)
    }

    const getTanggal = async () => {
        const res = await axios.get("http://localhost:3000/penjualan/tanggal-aktif")
        // Format: "Senin, 28 April 2026"
        const date = new Date(res.data.tanggal)
        const formatted = date.toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        })
        setTanggal(formatted)
    }

    useEffect(() => {
        getData()
        getTanggal()
    }, [])

    const handleUpdate = async (item, stokAkhir) => {
        if (stokAkhir === "") return
        const stokAwalNum = Number(item.stok_awal)
        const stokAkhirNum = Number(stokAkhir)
        const hargaNum = Number(item.harga)

        const prevVal = prevValuesRef.current[item.id_detail]
        if (prevVal === stokAkhirNum) return
        prevValuesRef.current[item.id_detail] = stokAkhirNum

        if (stokAkhirNum > stokAwalNum) {
            alert("Stok akhir tidak boleh melebihi stok awal")
            return
        }

        const jumlah_terjual = stokAwalNum - stokAkhirNum
        const subtotal = jumlah_terjual * hargaNum

        try {
            await axios.put(`http://localhost:3000/penjualan/${item.id_detail}`, {
                stok_akhir: stokAkhirNum,
                jumlah_terjual,
                subtotal
            })
            getData()
        } catch (err) {
            console.error(err)
            alert("Gagal update")
        }
    }

    const handleEditStokAwal = async () => {
        if (newStokAwal === "") return
        try {
            await axios.patch(`http://localhost:3000/penjualan/${editItem.id_detail}/stok-awal`, {
                stok_awal: Number(newStokAwal)
            })
            setEditItem(null)
            setNewStokAwal("")
            getData()
        } catch (err) {
            console.error(err)
            alert("Gagal update stok awal")
        }
    }

    const formatRupiah = (num) => {
        if (!num && num !== 0) return "-"
        return "Rp " + Number(num).toLocaleString("id-ID")
    }

    // Pagination
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentData = data.slice(startIndex, startIndex + itemsPerPage)

    // Summary
    const totalTerjual = data.reduce((sum, item) => sum + (Number(item.jumlah_terjual) || 0), 0)
    const totalPendapatan = data.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                {/* Navbar dengan tanggal */}
                <Navbar>
                    <span className="text-slate-500 text-sm font-medium mr-4">{tanggal}</span>
                    <TambahStok onSuccess={getData} />
                </Navbar>

                <div className="py-6 px-8 text-lg">
                    {/* Header tabel */}
                    <div className="grid grid-cols-8 bg-slate-200 border border-slate-400 rounded-lg">
                        <div className="p-2 text-center font-semibold">No</div>
                        <div className="p-2 text-center font-semibold">Nama</div>
                        <div className="p-2 text-center font-semibold">Harga</div>
                        <div className="p-2 text-center font-semibold">Stok Awal</div>
                        <div className="p-2 text-center font-semibold">Stok Akhir</div>
                        <div className="p-2 text-center font-semibold">Terjual</div>
                        <div className="p-2 text-center font-semibold">Total</div>
                        <div className="p-2 text-center font-semibold">Aksi</div>
                    </div>

                    {/* Rows */}
                    {currentData.map((item, index) => (
                        <div key={item.id_detail}
                            className="grid grid-cols-8 my-2 py-2 rounded-lg bg-white border border-slate-400">
                            <div className="p-2 text-center">{startIndex + index + 1}</div>
                            <div className="p-2 text-center">{item.nama_produk}</div>
                            <div className="p-2 text-center">{formatRupiah(item.harga)}</div>
                            <div className="p-2 text-center">{item.stok_awal}</div>
                            <div className="p-2 text-center">
                                <input
                                    type="number"
                                    defaultValue={item.stok_akhir}
                                    className="w-20 border rounded text-center"
                                    onBlur={(e) => handleUpdate(item, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdate(item, e.target.value)
                                    }}
                                />
                            </div>
                            <div className="p-2 text-center">{item.jumlah_terjual ?? "-"}</div>
                            <div className="p-2 text-center">{formatRupiah(item.subtotal)}</div>
                            <div className="p-2 text-center">
                                <button
                                    onClick={() => { setEditItem(item); setNewStokAwal(item.stok_awal) }}
                                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit Stok
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-4">
                            <button
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === page
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white hover:bg-slate-100 border-slate-300"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* Summary cards */}
                    <div className="flex gap-4 mt-6">
                        <div className="flex-1 bg-white border border-slate-300 rounded-xl px-6 py-4 shadow-sm">
                            <p className="text-sm text-slate-500 mb-1">Total Produk Terjual</p>
                            <p className="text-2xl font-bold text-slate-700">{totalTerjual} <span className="text-base font-normal text-slate-400">item</span></p>
                        </div>
                        <div className="flex-1 bg-white border border-slate-300 rounded-xl px-6 py-4 shadow-sm">
                            <p className="text-sm text-slate-500 mb-1">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-green-600">{formatRupiah(totalPendapatan)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Stok Awal */}
            {editItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
                        <h2 className="text-lg font-bold mb-1">Edit Stok Awal</h2>
                        <p className="text-sm text-slate-500 mb-4">{editItem.nama_produk}</p>
                        <label className="text-sm font-medium">Stok Awal Baru</label>
                        <input
                            type="number"
                            value={newStokAwal}
                            onChange={(e) => setNewStokAwal(e.target.value)}
                            className="w-full border rounded px-3 py-2 mt-1 mb-4 text-center text-lg"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button onClick={handleEditStokAwal}
                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                                Simpan
                            </button>
                            <button onClick={() => { setEditItem(null); setNewStokAwal("") }}
                                className="flex-1 bg-slate-200 py-2 rounded hover:bg-slate-300">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}