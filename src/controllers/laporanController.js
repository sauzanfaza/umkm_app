// controllers/laporanController.js (file baru)
const db = require('../config/db')

// controllers/laporanController.js
const getToday = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

exports.getTanggalList = (req, res) => {
    const sql = `
        SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal
        FROM penjualan_harian
        ORDER BY tanggal DESC
    `
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
}

exports.getLaporan = (req, res) => {
    const { tanggal } = req.query
    const targetTanggal = tanggal || getToday()

    const sql = `
        SELECT 
            dp.id_detail,
            p.nama_produk,
            p.harga,
            dp.stok_awal,
            dp.stok_akhir,
            dp.jumlah_terjual,
            dp.subtotal,
            DATE_FORMAT(ph.tanggal, '%Y-%m-%d') as tanggal,
            ph.total_pendapatan,
            ph.id_penjualan
        FROM detail_penjualan dp
        JOIN produk p ON dp.id_produk = p.id_produk
        JOIN penjualan_harian ph ON dp.id_penjualan = ph.id_penjualan
        WHERE DATE_FORMAT(ph.tanggal, '%Y-%m-%d') = ?
        ORDER BY dp.id_detail ASC
    `

    db.query(sql, [targetTanggal], (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
}