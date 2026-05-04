import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import TambahProduk from "../Components/TambahProduk";
import EditProduk from "../Components/EditProduk";
import { useSearch } from "../../SearchContext";

export default function Produk() {
  const [produk, setProduk] = useState([]);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const {keyword} = useSearch()

  useEffect(() => {
    getProduk();
  }, []);

  const getProduk = async () => {
    try {
      const res = await axios.get("http://localhost:3000/produk");
      setProduk(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setSelectedProduk(item);
    setOpenEdit(true);
  };

  const deleteProduk = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus produk ini?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/produk/${id}`);
      getProduk();
    } catch (err) {
      console.error(err);
    }
  };

  //filter data dari searchbar
  const filteredProduk = produk.filter((item) =>
  item.nama_produk.toLowerCase().includes(keyword.toLowerCase())
);

  // Hitung pagination
  const totalPages = Math.ceil(produk.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProduk.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar title="Produk">
          <TambahProduk onSuccess={getProduk} />
        </Navbar>

        <SearchBar />

        {/* product list */}
        <div className="py-4 px-8 text-lg">
          <div className="grid grid-cols-4 bg-slate-200 border border-slate-400 rounded-lg">
            <div className="p-2 text-center">No</div>
            <div className="p-2 text-center">Nama Produk</div>
            <div className="p-2 text-center">Harga</div>
            <div className="p-2 text-center">Action</div>
          </div>

          {currentData.map((item, index) => (
            <div
              key={item.id_produk}
              className="grid grid-cols-4 my-1 py-2 rounded-lg bg-white border border-slate-400"
            >
              <div className="p-2 text-center">{startIndex + index + 1}</div>
              <div className="p-2 text-center">{item.nama_produk}</div>
              <div className="p-2 text-center">{item.harga}</div>
              <div className="flex justify-center space-x-4 p-2">
                <button
                  className="text-lg hover:text-green-700 cursor-pointer"
                  onClick={() => handleEdit(item)}
                >
                  <BiEdit />
                </button>
                <button
                  className="text-lg hover:text-red-600 cursor-pointer"
                  onClick={() => deleteProduk(item.id_produk)}
                >
                  <RiDeleteBin5Line />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {/* Nomor halaman */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-slate-100 border-slate-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>

        <EditProduk
          data={selectedProduk}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSuccess={getProduk}
        />
      </div>
    </div>
  );
}