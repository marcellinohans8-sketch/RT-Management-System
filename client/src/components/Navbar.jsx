import { FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-8">
      <div>
        <h1 className="font-bold text-xl">Sistem Administrasi Iuran RT</h1>
      </div>

      <div className="flex items-center gap-5">
        <FaBell className="text-xl text-gray-500" title="Notifikasi" />

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          RT
        </div>
      </div>
    </header>
  );
}

export default Navbar;
