// src/components/Navbar.jsx
// ✅ Navbar moderno y coherente con el diseño GoodDoggy
// Conserva toda la lógica de autenticación y responsive
// Solo se ajustan colores y estilo para integrarse visualmente

import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="bg-[#1B7A78] text-white shadow-md sticky top-0 z-50 transition-all">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🐾 Logo */}
          <Link
            to="/"
            className="font-extrabold text-xl tracking-wide text-white hover:text-[#FFD166] transition-colors"
          >
            GoodDoggy
          </Link>

          {/* Botón menú móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-md hover:bg-[#166563] transition"
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Links en escritorio */}
          <div className="hidden sm:flex gap-6 items-center">
            <Link to="/services" className="hover:text-[#FFD166] font-medium">
              Servicios
            </Link>
            <Link to="/community" className="hover:text-[#FFD166] font-medium">
              Comunidad
            </Link>
            <Link to="/alerts" className="hover:text-[#FFD166] font-medium">
              Alertas
            </Link>
            <Link to="/dogs" className="hover:text-[#FFD166] font-medium">
              Mis Perros
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="font-semibold hover:text-[#FFD166] transition"
              >
                Panel Admin
              </Link>
            )}
          </div>

          {/* Usuario / Auth */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium">
                  👋 {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#FFD166] text-[#1B7A78] hover:bg-[#fdd77a] px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                {/* 🔹 Simplificados para armonizar con el tema */}
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg font-semibold border border-white hover:bg-white hover:text-[#1B7A78] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg font-semibold border border-[#FFD166] text-[#FFD166] hover:bg-[#FFD166] hover:text-[#1B7A78] transition-all"
                >
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Menú móvil */}
      {menuOpen && (
        <div className="sm:hidden bg-[#166563] border-t border-[#145956] animate-slide-down shadow-inner">
          <div className="flex flex-col px-4 py-3 space-y-3 text-white">
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#FFD166] font-medium"
            >
              Servicios
            </Link>
            <Link
              to="/community"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#FFD166] font-medium"
            >
              Comunidad
            </Link>
            <Link
              to="/alerts"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#FFD166] font-medium"
            >
              Alertas
            </Link>
            <Link
              to="/dogs"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#FFD166] font-medium"
            >
              Mis Perros
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="font-semibold hover:text-[#FFD166]"
              >
                Panel Admin
              </Link>
            )}

            <div className="border-t border-[#145956] mt-2 pt-3">
              {user ? (
                <>
                  <span className="block text-sm mb-2">
                    👋 {user.name || user.email}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-[#FFD166] text-[#1B7A78] w-full py-2 rounded-lg font-semibold hover:bg-[#fdd77a] transition"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="border border-white text-white w-full block text-center py-2 rounded-lg font-semibold hover:bg-white hover:text-[#1B7A78] transition mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="border border-[#FFD166] text-[#FFD166] w-full block text-center py-2 rounded-lg font-semibold hover:bg-[#FFD166] hover:text-[#1B7A78] transition"
                  >
                    Registro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
