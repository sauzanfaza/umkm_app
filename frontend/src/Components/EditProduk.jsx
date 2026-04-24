import { useState, useEffect } from "react";
import axios from "axios";

export default function EditProduk({ data, open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama_produk: "",
    harga: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_produk: data.nama_produk,
        harga: data.harga,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/produk/${data.id_produk}`, form);

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="mb-4 font-semibold">Edit Produk</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nama_produk"
            value={form.nama_produk}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Batal
            </button>
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}