const db = require('../config/db')

//ambil semua produk 
exports.getProduk = (req, res) => {
    db.query('SELECT * FROM produk', (err, result) => {
        if(err) {
            return res.status(500).json(err)
        }
        res.json(result)
    })
}

//tambah produk
exports.createProduk = (req, res) => {
    const {nama_produk, harga, stok} = req.body

    const sql = `INSERT INTO produk (nama_produk, harga, stok) VALUES (?, ?, ?)`

    db.query(sql, [nama_produk, harga, stok], (err, result) => {
        if(err) {
            return res.status(500).json(err)
        }
        res.json({
            message: 'Produk berhasil ditambahkan',
            data: result
        })
    })
}