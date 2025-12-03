// src/components/LostPetCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteLostPet } from "../services/lostpets";

export default function LostPetCard({ pet, onDeleted }) {
  const { user } = useAuth();

  // Foto
  const foto = pet.foto
    ? `${import.meta.env.VITE_BASE_URL}${pet.foto}`
    : "/default.png";

  // Validación dueño o admin
  const canDelete =
    user && (user.role === "admin" || user._id === pet.createdBy);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    try {
      await deleteLostPet(pet._id);
      if (onDeleted) onDeleted(pet._id);
    } catch (err) {
      console.error(err);
      alert("Error eliminando");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      {/* Imagen estilo Instagram */}
      <Link to={`/lostpets/${pet._id}`}>
        <img
          src={foto}
          alt={pet.nombre}
          className="w-full h-80 object-cover"
        />
      </Link>

      <div className="p-4">
        <h3 className="font-bold text-lg">{pet.nombre}</h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {pet.descripcion}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Zona: {pet.zona} · Tipo: {pet.tipo}
        </p>

        <p
          className={`mt-2 font-semibold text-sm ${
            pet.encontrado ? "text-green-600" : "text-red-600"
          }`}
        >
          {pet.encontrado ? "Encontrado" : "Aún perdido"}
        </p>

        {/* Eliminar si es dueño o admin */}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="mt-3 text-red-600 text-sm font-semibold"
          >
            Eliminar publicación
          </button>
        )}
      </div>
    </div>
  );
}
