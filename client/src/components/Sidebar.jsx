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
    name: "Residents",
    path: "/residents",
    icon: <FaUsers />,
  },
  {
    name: "Houses",
    path: "/houses",
    icon: <FaHouseUser />,
  },
  {
    name: "Resident History",
    path: "/resident-histories",
    icon: <FaHistory />,
  },
  {
    name: "Payments",
    path: "/payments",
    icon: <FaMoneyBillWave />,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: <FaWallet />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaChartBar />,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-center">RT Management</h1>

        <p className="text-sm text-slate-400 text-center mt-1">
          Administration System
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
