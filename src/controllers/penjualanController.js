const db = require('../config/db')

//ambil data produk yang mau di aktifkan
exports.getPenjualan = (req, res) => {
    const sql = `
        SELECT dp.*, p.nama_produk, p.harga
        FROM detail_penjualan dp
        JOIN produk p ON dp.id_produk = p.id_produk
    `

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
}

//
exports.createPenjualan = (req, res) => {
  const { id_produk, stok_awal } = req.body

  const today = new Date().toISOString().slice(0, 10)

  // 1. cek penjualan hari ini
  const cekSql = `SELECT * FROM penjualan_harian WHERE tanggal = ?`

  db.query(cekSql, [today], (err, result) => {
    if (err) return res.status(500).json(err)

    if (result.length > 0) {
      insertDetail(result[0].id_penjualan)
    } else {
      // 2. buat penjualan baru
      const insertPenjualan = `INSERT INTO penjualan_harian (tanggal) VALUES (?)`

      db.query(insertPenjualan, [today], (err, result2) => {
        if (err) return res.status(500).json(err)

        insertDetail(result2.insertId)
      })
    }
  })

  function insertDetail(id_penjualan) {
    const sql = `
      INSERT INTO detail_penjualan 
      (id_penjualan, id_produk, stok_awal, stok_akhir, jumlah_terjual, subtotal)
      VALUES (?, ?, ?, 0, 0, 0)
    `

    db.query(sql, [id_penjualan, id_produk, stok_awal], (err) => {
      if (err) return res.status(500).json(err)

      res.json({ message: "Data berhasil masuk" })
    })
  }
}

//update data stok akhir
// exports.updatePenjualan = (req, res) => {
//   const { id } = req.params
//   const { stok_akhir, jumlah_terjual, subtotal} = req.body

//   const sql = `
//     UPDATE detail_penjualan 
//     SET stok_akhir = ?, jumlah_terjual = ?, subtotal = ?
//     WHERE id_detail = ?
//   `

//   db.query(sql, [stok_akhir, jumlah_terjual, subtotal, id], (err) => {
//     if(err) return res.status(500).json(err)

//     res.json({ message: "Berhasil update" })
//   })
// }

// update data stok akhir
exports.updatePenjualan = (req, res) => {
    const { id } = req.params;
    
    // 1. Ambil data dan paksa jadi Number agar tidak jadi string kosong/undefined
    const stok_akhir = Number(req.body.stok_akhir) || 0;
    const jumlah_terjual = Number(req.body.jumlah_terjual) || 0;
    const subtotal = Number(req.body.subtotal) || 0;

    // 2. Debugging: cek di cmd apakah angkanya masuk atau NaN
    console.log(`Update ID ${id}: Terjual ${jumlah_terjual}, Subtotal ${subtotal}`);

    const sql = `
        UPDATE detail_penjualan 
        SET stok_akhir = ?, jumlah_terjual = ?, subtotal = ?
        WHERE id_detail = ?
    `;

    db.query(sql, [stok_akhir, jumlah_terjual, subtotal, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        
        // 3. Pastikan id nya benaran ada yang ter update
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.json({ message: "Berhasil update" });
    });
};

exports.updateStokAwal = (req, res) => {
    const { id } = req.params
    const stok_awal = Number(req.body.stok_awal)

    const sql = `
        UPDATE detail_penjualan 
        SET stok_awal = ?, stok_akhir = 0, jumlah_terjual = 0, subtotal = 0
        WHERE id_detail = ?
    `

    db.query(sql, [stok_awal, id], (err, result) => {
        if (err) return res.status(500).json(err)
        if (result.affectedRows === 0) return res.status(404).json({ message: "Tidak ditemukan" })
        res.json({ message: "Stok awal berhasil diupdate" })
    })
}

// Tambah di controller
exports.getTanggalAktif = (req, res) => {
    const today = new Date().toISOString().slice(0, 10)
    const sql = `SELECT id_penjualan, tanggal FROM penjualan_harian WHERE tanggal = ?`
    db.query(sql, [today], (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result[0] || { tanggal: today })
    })
}

// Update getPenjualan — filter hari ini
exports.getPenjualan = (req, res) => {
    const today = new Date().toISOString().slice(0, 10)
    const sql = `
        SELECT dp.*, p.nama_produk, p.harga
        FROM detail_penjualan dp
        JOIN produk p ON dp.id_produk = p.id_produk
        JOIN penjualan_harian ph ON dp.id_penjualan = ph.id_penjualan
        WHERE ph.tanggal = ?
    `
    db.query(sql, [today], (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
}

//closing harian
exports.closingHarian = (req, res) => {
    const { id } = req.params
    const total_pendapatan = Number(req.body.total_pendapatan) || 0

    console.log("closing id:", id, "total:", total_pendapatan) // debug

    const sql = `
        UPDATE penjualan_harian 
        SET total_pendapatan = ?
        WHERE id_penjualan = ?
    `

    db.query(sql, [total_pendapatan, id], (err, result) => {
        if (err) {
            console.error("Error closing:", err) // lihat error spesifiknya di terminal
            return res.status(500).json(err)
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Tidak ditemukan" })
        res.json({ message: "Closing berhasil disimpan" })
    })
}