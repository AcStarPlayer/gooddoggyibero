// ============================
// Dashboard.jsx
// ============================
// 🔸 Se integra Sidebar dentro del layout principal.
// 🔸 Se ajusta el espacio lateral para evitar solapamiento.
// 🔸 Diseño visual más limpio y centrado.
// ============================

import React from "react";
import Sidebar from "../components/Sidebar"; // 👉 Asegúrate de importar tu Sidebar

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ---------- SIDEBAR ---------- */}
      <Sidebar />

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">
          {/* Bienvenida */}
          <h1 className="text-3xl font-extrabold text-orange-600 mb-4">
            Bienvenido a tu Panel de Usuario 🐶
          </h1>
          <p className="text-gray-700 mb-10">
            Gestiona tus perros, servicios y reservas fácilmente.
          </p>

          {/* Sección: Mis Perros */}
          <section className="mb-8 text-left">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              🐕 Mis Perros
            </h2>
            <p className="text-gray-500 mt-1">Aún no has registrado perros.</p>
          </section>

          {/* Sección: Servicios Disponibles */}
          <section className="mb-8 text-left">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              🧼 Servicios Disponibles
            </h2>

            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-6 shadow-md w-64">
              <h3 className="text-lg font-semibold text-blue-600">
                Baño Canino
              </h3>
              <p className="text-sm text-gray-600">
                Servicio completo de baño y secado.
              </p>
              <p className="font-bold mt-2">$25,000</p>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Reservar
              </button>
            </div>
          </section>

          {/* Sección: Mis Reservas */}
          <section className="text-left">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              📅 Mis Reservas
            </h2>
            <p className="text-gray-500 mt-1">
              Aún no tienes reservas registradas.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
