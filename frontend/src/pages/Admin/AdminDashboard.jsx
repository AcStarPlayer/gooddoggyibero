import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FaUsers,
  FaDog,
  FaHospital,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSearch,
  FaCog,
} from "react-icons/fa";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    users: 0,
    dogs: 0,
    services: 0,
    vets: 0,
    events: 0,
    lostpets: 0,
    alerts: 0,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
    } catch (e) {
      console.error("Error cargando dashboard:", e);
    }
  };

  const cards = [
    { title: "Usuarios", value: stats.users, icon: <FaUsers /> },
    { title: "Perros", value: stats.dogs, icon: <FaDog /> },
    { title: "Servicios", value: stats.services, icon: <FaCog /> },
    { title: "Veterinarias", value: stats.vets, icon: <FaHospital /> },
    { title: "Eventos", value: stats.events, icon: <FaCalendarAlt /> },
    { title: "Mascotas perdidas", value: stats.lostpets, icon: <FaSearch /> },
    { title: "Alertas", value: stats.alerts, icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="p-6 bg-[#f7f9fb] min-h-screen">
      {/* Título */}
      <h1 className="text-4xl font-extrabold mb-12 text-[#0B6C75] drop-shadow-md">
        🐾 Panel Administrativo
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cards.map((card, i) => (
          <Card
            key={i}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}

const Card = ({ title, value, icon }) => (
  <div
    className="
      bg-white 
      p-8 
      rounded-3xl 
      shadow-xl 
      hover:shadow-2xl 
      transition 
      duration-300 
      border-4 
      border-orange-300
      flex 
      items-center 
      gap-6
      hover:scale-105
    "
  >
    <div className="text-6xl text-orange-500 drop-shadow-lg">{icon}</div>

    <div>
      <p className="text-gray-600 text-lg font-semibold">{title}</p>
      <p className="text-5xl font-extrabold text-[#0B6C75] drop-shadow-sm">
        {value}
      </p>
    </div>
  </div>
);
