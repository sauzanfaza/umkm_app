import { useState } from "react";
import axios from "axios";

export default function TambahProduk({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nama_produk: "",
    harga: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
  setForm({
    nama_produk: "",
    harga: "",
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/produk", form);

      setOpen(false);
      setForm({ nama_produk: "", harga: "" });

      if (onSuccess) onSuccess(); // refresh data event utk indikasi kalo data berhasil d tambah dan ditampilkan semunya
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="bg-[#004030] hover:bg-[#346739] text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        + Tambah Produk
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Tambah Produk</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="nama_produk"
                placeholder="Nama Produk"
                value={form.nama_produk}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="number"
                name="harga"
                placeholder="Harga"
                value={form.harga}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setOpen(false)
                }}
                  className="px-3 py-1 border rounded cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-[#004030] hover:bg-[#346739] cursor-pointer text-white px-3 py-1 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}