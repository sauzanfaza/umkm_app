import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import TambahProduk from "../Components/TambahProduk";
import EditProduk from "../Components/EditProduk";

export default function Produk() {
  const [produk, setProduk] = useState([]);
  const [selectedProduk, setSelectedProduk] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)

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
    setSelectedProduk(item)
    setOpenEdit(true)
  }

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

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar title="Produk">
          <TambahProduk onSuccess={getProduk} />
        </Navbar>

        <SearchBar/>

        {/* product list */}
        <div className="h-screen overflow-hidden py-4 px-8 text-lg">
            <div className="grid grid-cols-4 bg-slate-200 border border-slate-400 rounded-lg">
                <div className="p-2 text-center">No</div>
                <div className="p-2 text-center">Nama Produk</div>
                <div className="p-2 text-center">Harga</div>
                <div className="p-2 text-center">Action</div>
            </div>
          
          {produk.map((item, index) => (
            <div key={item.id_produk}
                className="grid grid-cols-4 my-2 py-2 rounded-lg bg-white border border-slate-400">
                    <div className="p-2 text-center">{index + 1}</div>
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