// src/components/VeterinariaCard.jsx
import Stars from "./Stars";
import { Link } from "react-router-dom";

export default function VeterinariaCard({ v }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg flex flex-col">
      <h2 className="text-xl font-bold mb-2">{v.nombre}</h2>

      <Stars rating={v.average || 0} />

      <p className="text-gray-600 mt-2">{v.descripcion}</p>

      <Link
        to={`/vet/${v._id}`}
        className="mt-4 bg-[#127C87] text-white px-3 py-2 rounded text-center"
      >
        Ver Perfil
      </Link>
    </div>
  );
}
