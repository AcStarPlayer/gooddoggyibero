// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-orange-500 text-white flex flex-col justify-between shadow-xl">
      {/* Logo y nombre */}
      <div className="p-6 flex flex-col items-center border-b border-orange-400">
        <img
          src="/logo.png"
          alt="Good Doggy"
          className="w-16 h-16 mb-3 rounded-full border-2 border-white"
        />
        <h2 className="text-lg font-bold">GOOD DOGGY</h2>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-6 mt-6 space-y-4 text-lg font-medium">
        <Link to="/dashboard/perfil" className="block hover:text-yellow-200">
          Mi Perfil
        </Link>

        <div>
          <p className="font-semibold">Doggys</p>
          <div className="ml-4 mt-2 space-y-2">
            <Link to="/dashboard/MisMascotas" className="block hover:text-yellow-200">
              Ver Doggys
            </Link>
            <Link to="/dashboard/MisMascotas/agregar" className="block hover:text-yellow-200">
              Agregar Doggy
            </Link>
          </div>
        </div>

        {/*<Link to="/dashboard/MisMascotas" className="font-semibold">
          Doggys
        </Link>

        <div className="ml-4 flex flex-col space-y-2">
          <Link to="/dashboard/mis-mascotas/1">Doggy 1</Link>
          <Link to="/dashboard/mis-mascotas/2">Doggy 2</Link>
        </div>*/}

        <Link to="/dashboard/directorio" className="block hover:text-yellow-200">
          Directorio
        </Link>

        <Link to="/dashboard/community" className="block hover:text-yellow-200">
          Comunidad
        </Link>

        <Link to="/dashboard/calendar" className="block hover:text-yellow-200">
          Calendario
        </Link>

        <Link to="/dashboard/lostpets" className="block hover:text-yellow-200">
          Doggy perdido
        </Link>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-white text-orange-600 font-semibold py-2 rounded-md hover:bg-orange-100"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
