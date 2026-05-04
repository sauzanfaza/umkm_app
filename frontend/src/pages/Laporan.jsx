import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

export default function Laporan() {
    const [data, setData] = useState([])
    const [tanggalList, setTanggalList] = useState([])
    const [selectedTanggal, setSelectedTanggal] = useState("")
    const [loading, setLoading] = useState(false)

    // Format tanggal tanpa timezone shift
    const formatTanggal = (tgl) => {
        if (!tgl) return "-"
        const [year, month, day] = tgl.slice(0, 10).split("-")
        const date = new Date(year, month - 1, day) // local time, bukan UTC
        return date.toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        })
    }

    const getTanggalList = async () => {
        try {
            const res = await axios.get("http://localhost:3000/laporan/tanggal-list")
            const list = res.data // [{tanggal: "2026-05-01"}, ...]
            setTanggalList(list)
            if (list.length > 0) setSelectedTanggal(list[0].tanggal)
        } catch (err) {
            console.error(err)
        }
    }

    const getLaporan = async (tanggal) => {
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:3000/laporan?tanggal=${tanggal}`)
            setData(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTanggalList()
    }, [])

    useEffect(() => {
        if (selectedTanggal) getLaporan(selectedTanggal)
    }, [selectedTanggal])

    const formatRupiah = (num) => {
        if (!num && num !== 0) return "-"
        return "Rp " + Number(num).toLocaleString("id-ID")
    }

    // Summary
    const totalTerjual = data.reduce((sum, item) => sum + (Number(item.jumlah_terjual) || 0), 0)
    const totalPendapatan = data.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)

    // Export Excel
    const handleExport = async () => {
    if (data.length === 0) return alert("Tidak ada data untuk diexport")

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Laporan")

    // Header kolom
    sheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Nama Produk", key: "nama_produk", width: 25 },
        { header: "Harga Satuan", key: "harga", width: 15 },
        { header: "Stok Awal", key: "stok_awal", width: 12 },
        { header: "Stok Akhir", key: "stok_akhir", width: 12 },
        { header: "Terjual", key: "terjual", width: 10 },
        { header: "SubTotal (Rp)", key: "subtotal", width: 18 },
    ]

    // Style header
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2E8F0" }
        }
    })

    // Isi data
    data.forEach((item, index) => {
        sheet.addRow({
            no: index + 1,
            nama_produk: item.nama_produk,
            harga: item.harga,
            stok_awal: item.stok_awal,
            stok_akhir: item.stok_akhir,
            terjual: item.jumlah_terjual,
            subtotal: item.subtotal
        })
    })

    // Baris total
    const totalRow = sheet.addRow({
        no: "",
        nama_produk: "TOTAL",
        harga: "",
        stok_awal: "",
        stok_akhir: "",
        terjual: totalTerjual,
        subtotal: totalPendapatan
    })
    totalRow.eachCell((cell) => {
        cell.font = { bold: true }
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" } // hijau muda
        }
    })

    // Download
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/octet-stream" })
    saveAs(blob, `Laporan_${selectedTanggal}.xlsx`)
}

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen">
                <Navbar title="Laporan"></Navbar>

                <div className="p-6 flex-1 overflow-hidden flex flex-col">
                    {/* Ringkasan */}
                    <h1 className="font-bold text-2xl mb-4">Ringkasan</h1>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="border border-slate-400 py-6 px-6 rounded-xl">
                            <h1 className="font-semibold text-slate-500">Total Pendapatan</h1>
                            <p className="my-3 text-3xl font-bold text-green-600">{formatRupiah(totalPendapatan)}</p>
                        </div>
                        <div className="border border-slate-400 py-6 px-6 rounded-xl">
                            <h1 className="font-semibold text-slate-500">Total Terjual</h1>
                            <p className="my-3 text-3xl font-bold">{totalTerjual} <span className="text-base font-normal text-slate-400">item</span></p>
                        </div>
                        <div className="border border-slate-400 py-6 px-6 rounded-xl flex flex-col justify-center">
                            <h1 className="font-semibold text-slate-500 mb-2">Pilih Tanggal</h1>
                            <select
                                value={selectedTanggal}
                                onChange={(e) => setSelectedTanggal(e.target.value)}
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {tanggalList.map(item => (
                                    <option key={item.tanggal} value={item.tanggal}>
                                        {formatTanggal(item.tanggal)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Detail Penjualan */}
                    <h1 className="font-bold text-2xl mb-3">Detail Penjualan</h1>

                    {/* Header tabel */}
                    <div className="grid grid-cols-5 p-3 bg-slate-200 border border-slate-400 rounded-lg text-sm font-semibold">
                        <div>No</div>
                        <div>Nama Produk</div>
                        <div className="text-center">Harga</div>
                        <div className="text-center">Terjual</div>
                        <div className="text-center">SubTotal</div>
                    </div>

                    {/* List scrollable */}
                    <div className="flex-1 overflow-y-auto mt-1">
                        {loading ? (
                            <div className="text-center text-slate-400 py-10">Memuat data...</div>
                        ) : data.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">Tidak ada data</div>
                        ) : (
                            data.map((item, index) => (
                                <div key={item.id_detail}
                                    className="grid grid-cols-5 p-3 my-1 bg-white border border-slate-300 rounded-lg text-sm">
                                    <div>{index + 1}</div>
                                    <div>{item.nama_produk}</div>
                                    <div className="text-center">{formatRupiah(item.harga)}</div>
                                    <div className="text-center">{item.jumlah_terjual ?? "-"}</div>
                                    <div className="text-center">{formatRupiah(item.subtotal)}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Baris Total */}
                    <div className="grid grid-cols-5 p-3 mt-2 bg-slate-100 border border-slate-400 rounded-lg text-sm font-bold">
                        <div className="col-span-3">Total</div>
                        <div className="text-center">{totalTerjual} item</div>
                        <div className="text-center text-green-600">{formatRupiah(totalPendapatan)}</div>
                    </div>

                    {/* Tombol Export */}
                    <button
                        onClick={handleExport}
                        className="mt-4 self-end bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
                    >
                        Export Excel
                    </button>
                </div>
            </div>
        </div>
    )
}