// src/pages/DashboardLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [dogs, setDogs] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const res = await api.get("/dogs");
      setDogs(res.data);
    } catch (err) {
      console.error("Error cargando perros:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔸 Barra lateral fija */}
      <Sidebar />

      {/* 🔸 Contenedor principal */}
      <div className="flex-1 flex flex-col ml-64">
        {/* 🔹 Encabezado superior */}
        <header className="bg-[#197c83] text-white py-3 px-8 shadow-md flex justify-between items-center fixed top-0 left-64 right-0 z-10">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Good Doggy"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <h1 className="text-xl font-bold tracking-wide">GOOD DOGGY</h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-[#197c83] font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Cerrar sesión
          </button>
        </header>

        {/* 🔹 Contenido dinámico */}
        <main className="flex-1 p-8 mt-[80px]">
          <div className="bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-140px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

