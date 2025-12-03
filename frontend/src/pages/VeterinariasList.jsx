import { useEffect, useState } from "react";
import api from "../services/api";
import VeterinariaCard from "../components/VeterinariaCard";
import { Link } from "react-router-dom";

export default function VeterinariasList() {
  const [vets, setVets] = useState([]);
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    loadVets();
  }, []);

  const loadVets = async () => {
    const res = await api.get("/veterinarias");
    
    const lista = res.data.veterinarias || res.data || res.veterinarias || [];

    // 🔥 Agregar promedio dinámico
    const conPromedio = await Promise.all(
      lista.map(async (v) => {
        try {
          const avg = await api.get(`/reviews/${v._id}/average`);
          return { ...v, average: avg.data.average };
        } catch (e) {
          return { ...v, average: 0 };
        }
      })
    );

    setVets(conPromedio);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Directorio</h1>
      <h2 className="text-2xl font-semibold mb-6">Veterinarias</h2>

      {isAdmin && (
        <Link
          to="/crear-veterinaria"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          + Agregar Veterinaria
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {vets.map((v) => (
          <VeterinariaCard key={v._id} v={v} />
        ))}
      </div>
    </div>
  );
}

