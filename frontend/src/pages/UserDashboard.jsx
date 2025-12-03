// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api"; // ✅ Asegúrate de importar desde la ruta correcta
import BookingModal from "../components/BookingModal";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const [dogs, setDogs] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ===============================
  // 📦 Cargar datos iniciales
  // ===============================
  useEffect(() => {
    fetchDogs();
    fetchServices();
    fetchBookings();
  }, []);

  const fetchDogs = async () => {
    try {
      const res = await api.get("/dogs");
      setDogs(res.data);
    } catch (err) {
      console.error("Error cargando perros:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/mine");
      setBookings(res.data);
    } catch (err) {
      console.error("Error cargando reservas:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ===============================
  // 🎨 INTERFAZ VISUAL
  // ===============================
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ===============================
          🔸 NAVBAR LATERAL FIJO
      =============================== */}
      <aside className="w-64 bg-orange-500 text-white flex flex-col justify-between py-8 px-6 shadow-xl fixed top-0 bottom-0 left-0">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-center">🐾 GOOD DOGGY</h1>

          <nav className="space-y-4">
            <button className="block w-full text-left font-semibold hover:text-yellow-200 transition">
              Mi Perfil
            </button>

            <div>
              <p className="font-semibold mb-2">Doggys</p>
              <ul className="space-y-1 pl-3">
                {dogs.length === 0 ? (
                  <li className="text-sm text-yellow-200 italic">
                    Sin perros aún
                  </li>
                ) : (
                  dogs.map((d, i) => (
                    <li
                      key={d._id}
                      className="hover:text-yellow-200 cursor-pointer"
                    >
                      🐕 {d.name || `Doggy ${i + 1}`}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <button className="block w-full text-left hover:text-yellow-200 transition">
              Directorio
            </button>
            <button className="block w-full text-left hover:text-yellow-200 transition">
              Comunidad
            </button>
            <button className="block w-full text-left hover:text-yellow-200 transition">
              Calendario
            </button>
            <button className="block w-full text-left hover:text-yellow-200 transition">
              Doggy perdido
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 text-center font-semibold hover:text-yellow-300 transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* ===============================
          🔹 CONTENIDO PRINCIPAL
      =============================== */}
      <main className="flex-1 ml-64 py-10 px-8">
        {/* 🔹 Encabezado principal */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-extrabold text-blue-700 mb-2">
            🐾 Bienvenido a tu Panel de Usuario
          </h2>
          <p className="text-gray-600">
            Gestiona tus perros, servicios y reservas fácilmente.
          </p>
        </motion.div>

        <div className="space-y-10">
          {/* 🐶 Sección de Perros */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🐕 Mis Perros
            </h3>

            {dogs.length === 0 ? (
              <p className="text-gray-500 italic">
                Aún no has registrado perros.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map((d) => (
                  <motion.div
                    key={d._id}
                    className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}${d.photoUrl}`}
                      alt={d.name}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-blue-700">
                        {d.name}
                      </h4>
                      <p className="text-gray-600">{d.breed}</p>
                      <p className="text-sm text-gray-500">{d.age} años</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* 💼 Sección de Servicios */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🛠️ Servicios Disponibles
            </h3>

            {services.length === 0 ? (
              <p className="text-gray-500 italic">
                No hay servicios disponibles.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <motion.div
                    key={s._id}
                    className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition-transform"
                    whileHover={{ scale: 1.02 }}
                  >
                    {s.imageUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${s.imageUrl}`}
                        alt={s.name}
                        className="w-full h-44 object-cover rounded-xl mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-blue-700 text-lg">
                      {s.name}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {s.description}
                    </p>
                    <p className="font-bold text-gray-900 mt-2">${s.price}</p>
                    <button
                      onClick={() => setShowModal(s)}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all w-full"
                    >
                      Reservar
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* 📅 Historial de Reservas */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📆 Mis Reservas
            </h3>

            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
              {bookings.length === 0 ? (
                <p className="text-gray-500 italic">
                  Aún no tienes reservas registradas.
                </p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-gray-700">
                      <th className="pb-2">🐕 Perro</th>
                      <th className="pb-2">🛠️ Servicio</th>
                      <th className="pb-2">📅 Fecha</th>
                      <th className="pb-2">⏰ Hora</th>
                      <th className="pb-2">🔖 Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b._id}
                        className="border-b hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-2">{b.dog?.name}</td>
                        <td>{b.service?.name}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td
                          className={`font-semibold ${
                            b.status === "completado"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {b.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* 🧩 Modal de reserva */}
        {showModal && (
          <BookingModal
            service={showModal}
            dogs={dogs}
            onClose={() => setShowModal(false)}
            onBooked={fetchBookings}
          />
        )}
      </main>
    </div>
  );
}
