import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* KANAN (NAVBAR + CONTENT) */}
      <div className="flex-1">
        
        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="p-4">
          <h1>Dashboard</h1>
        </div>

      </div>

    </div>
  );
}