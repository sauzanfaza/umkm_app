import { useState } from "react";
import { api } from "./api";

export default function App() {
const [produk, setProduk] = useState([]);
const [nama, setNama] = useState("");
const [harga, setHarga] = useState("");
const [stok, setStok] = useState("");

const fetchProduk = async () => {
    try{
        const res = await api.get("/produk")
        setProduk(res.data)
    } catch(err) {
        console.error(err)
    }
}

const tambahProduk = async () => {
    try{
        await api.post("/produk", {
            nama_produk: nama,
            harga: parseInt(harga),
            stok: parseInt(stok),
        })

        setNama("")
        setHarga("")
        setStok("")

        fetchProduk()
    } catch(err) {
        console.error(err)
    }
}

return (
    <div style={{ padding: "20px" }}>
      <h1>Manajemen Produk</h1>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nama Produk"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
        />
        <input
          placeholder="Stok"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
        />

        <button onClick={tambahProduk}>Tambah</button>
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
          </tr>
        </thead>

        <tbody>
          {produk.map((item) => (
            <tr key={item.id_produk}>
              <td>{item.nama_produk}</td>
              <td>{item.harga}</td>
              <td>{item.stok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}