import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaHouseUser,
  FaHistory,
  FaMoneyBillWave,
  FaWallet,
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
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        RT System
      </div>

      <nav className="p-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${isActive ? "bg-blue-600" : "hover:bg-slate-800"}`
            }
          >
            {menu.icon}
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
