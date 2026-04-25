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
    // console.log("BODY: ", req.body) //cek
    const {nama_produk, harga} = req.body

    const sql = `INSERT INTO produk (nama_produk, harga) VALUES (?, ?)`

    db.query(sql, [nama_produk, harga], (err, result) => {
        if(err) {
            return res.status(500).json(err)
        }
        res.json({
            message: 'Produk berhasil ditambahkan',
            data: result
        })
    })
}

//edit produk
exports.updateProduk = (req, res) => {
    const { id } = req.params;
    const { nama_produk, harga } = req.body;

    const sql = `UPDATE produk SET nama_produk = ?, harga = ? WHERE id_produk = ?`;

    db.query(sql, [nama_produk, harga, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json({ message: "Produk berhasil diupdate" });
    });
};

//delete produk
exports.deleteProduk = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM produk WHERE id_produk = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Produk berhasil dihapus" });
  });
};