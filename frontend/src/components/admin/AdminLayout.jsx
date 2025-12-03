import { NavLink, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaDog,
  FaHospital,
  FaCalendarAlt,
  FaSearch,
  FaExclamationTriangle,
  FaHome,
} from "react-icons/fa";

export default function AdminLayout() {
  const menu = [
    { to: "/admin", label: "Dashboard", icon: <FaHome /> },
    { to: "/admin/users", label: "Usuarios", icon: <FaUsers /> },
    { to: "/admin/dogs", label: "Perros", icon: <FaDog /> },
    { to: "/admin/veterinarias", label: "Veterinarias", icon: <FaHospital /> },
    { to: "/admin/events", label: "Eventos", icon: <FaCalendarAlt /> },
    { to: "/admin/lostpets", label: "Perdidos", icon: <FaSearch /> },
    { to: "/admin/alerts", label: "Alertas", icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F7F7]">

      {/* SIDEBAR */}
      <aside
        className="
          w-64 
          bg-orange-400 
          text-white 
          p-6 
          shadow-xl
          flex flex-col
        "
      >
        <h2 className="text-2xl font-extrabold mb-8 text-center">
          GOOD DOGGY · Admin
        </h2>

        <nav className="flex-1 flex flex-col gap-4">
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition 
                ${isActive ? "bg-white text-orange-500 shadow-lg" : "hover:bg-orange-300"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
