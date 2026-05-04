import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts"

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)

    const getDashboard = async () => {
        try {
            const res = await axios.get("http://localhost:3000/dashboard")
            setDashboard(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDashboard()
    }, [])

    const formatRupiah = (num) => {
        if (!num && num !== 0) return "Rp 0"
        return "Rp " + Number(num).toLocaleString("id-ID")
    }

    const formatTanggalPendek = (tgl) => {
        if (!tgl) return ""
        const [year, month, day] = tgl.split("-")
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    }

    const grafikData = dashboard?.grafik?.map(item => ({
        tanggal: formatTanggalPendek(item.tanggal),
        pendapatan: Number(item.total_pendapatan)
    })) || []

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar title="Dashboard"></Navbar>

                <div className="p-6">
                    {/* 3 Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {/* Total Pendapatan */}
                        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
                            <p className="text-sm text-slate-500 mb-1">Total Pendapatan Hari Ini</p>
                            <p className="text-2xl font-bold text-green-600">
                                {loading ? "..." : formatRupiah(dashboard?.total_pendapatan)}
                            </p>
                        </div>

                        {/* Total Terjual */}
                        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
                            <p className="text-sm text-slate-500 mb-1">Total Terjual Hari Ini</p>
                            <p className="text-2xl font-bold text-slate-700">
                                {loading ? "..." : dashboard?.total_terjual}{" "}
                                <span className="text-base font-normal text-slate-400">pcs</span>
                            </p>
                        </div>

                        {/* Produk Terlaris */}
                        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
                            <p className="text-sm text-slate-500 mb-1">Produk Terlaris Hari Ini</p>
                            {loading ? (
                                <p className="text-2xl font-bold text-slate-700">...</p>
                            ) : dashboard?.produk_terlaris ? (
                                <>
                                    <p className="text-xl font-bold text-slate-700">
                                        {dashboard.produk_terlaris.nama_produk}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Terjual {dashboard.produk_terlaris.total_terjual} pcs
                                    </p>
                                </>
                            ) : (
                                <p className="text-slate-400 text-sm mt-2">Belum ada data</p>
                            )}
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Grafik Penjualan (7 Hari Terakhir)</h2>
                        {grafikData.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">Belum ada data grafik</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={grafikData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="tanggal"
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}K`}
                                    />
                                    <Tooltip
                                        formatter={(val) => [formatRupiah(val), "Pendapatan"]}
                                        labelStyle={{ fontWeight: "bold" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pendapatan"
                                        stroke="#16a34a"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#16a34a" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}