import { IoIosSearch } from "react-icons/io";
import { useSearch } from "../../SearchContext";

export default function SearchBar() {
    const {setKeyword} = useSearch()

    return (
        <div className="p-4">
            <div className="relative">

                {/* icon */}
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

            <input 
            type="text"  
            placeholder="cari sesuatu"
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-4 rounded-lg border border-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
        </div>
    )
}