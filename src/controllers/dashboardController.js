const db = require('../config/db')

const getToday = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

exports.getDashboard = (req, res) => {
    const today = getToday()

    // Total pendapatan & terjual hari ini
    const sqlHariIni = `
        SELECT 
            COALESCE(SUM(dp.subtotal), 0) as total_pendapatan,
            COALESCE(SUM(dp.jumlah_terjual), 0) as total_terjual
        FROM detail_penjualan dp
        JOIN penjualan_harian ph ON dp.id_penjualan = ph.id_penjualan
        WHERE DATE_FORMAT(ph.tanggal, '%Y-%m-%d') = ?
    `

    // Produk terlaris hari ini
    const sqlTerlaris = `
        SELECT p.nama_produk, SUM(dp.jumlah_terjual) as total_terjual
        FROM detail_penjualan dp
        JOIN produk p ON dp.id_produk = p.id_produk
        JOIN penjualan_harian ph ON dp.id_penjualan = ph.id_penjualan
        WHERE DATE_FORMAT(ph.tanggal, '%Y-%m-%d') = ?
        ORDER BY total_terjual DESC
        LIMIT 1
    `

    // Grafik 7 hari terakhir
    const sqlGrafik = `
        SELECT 
            DATE_FORMAT(ph.tanggal, '%Y-%m-%d') as tanggal,
            COALESCE(SUM(dp.subtotal), 0) as total_pendapatan
        FROM penjualan_harian ph
        LEFT JOIN detail_penjualan dp ON ph.id_penjualan = dp.id_penjualan
        WHERE ph.tanggal >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE_FORMAT(ph.tanggal, '%Y-%m-%d')
        ORDER BY tanggal ASC
    `

    db.query(sqlHariIni, [today], (err, hariIni) => {
        if (err) return res.status(500).json(err)

        db.query(sqlTerlaris, [today], (err, terlaris) => {
            if (err) return res.status(500).json(err)

            db.query(sqlGrafik, (err, grafik) => {
                if (err) return res.status(500).json(err)

                res.json({
                    total_pendapatan: hariIni[0]?.total_pendapatan || 0,
                    total_terjual: hariIni[0]?.total_terjual || 0,
                    produk_terlaris: terlaris[0] || null,
                    grafik
                })
            })
        })
    })
}