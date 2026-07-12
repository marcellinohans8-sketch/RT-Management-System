import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaHouseUser,
  FaHistory,
  FaMoneyBillWave,
  FaWallet,
  FaChartBar,
} from "react-icons/fa";

const menus = [
  {
    name: "Dashboard",
    path: "/",
    icon: <FaHome />,
  },
  {
    name: "Penghuni",
    path: "/residents",
    icon: <FaUsers />,
  },
  {
    name: "Rumah",
    path: "/houses",
    icon: <FaHouseUser />,
  },
  {
    name: "Riwayat Hunian",
    path: "/resident-histories",
    icon: <FaHistory />,
  },
  {
    name: "Pembayaran",
    path: "/payments",
    icon: <FaMoneyBillWave />,
  },
  {
    name: "Pengeluaran",
    path: "/expenses",
    icon: <FaWallet />,
  },
  {
    name: "Laporan",
    path: "/reports",
    icon: <FaChartBar />,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-center">Administrasi RT</h1>

        <p className="text-sm text-slate-400 text-center mt-1">
          Iuran dan Kas Warga
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600 shadow-lg"
                  : "hover:bg-slate-800 hover:translate-x-1"
              }`
            }
          >
            <span className="text-lg">{menu.icon}</span>

            <span>{menu.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
