// src/pages/LostPetDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// 🔥 Importamos la función correcta del backend
import { getLostPet, toggleEncontrado } from "../services/lostpets";

export default function LostPetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  // ← para evitar doble clic cuando se actualiza el estado
  const [updating, setUpdating] = useState(false);

  // ==============================
  //   Cargar la mascota
  // ==============================
  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getLostPet(id);
      setPet(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!pet) return <p className="p-6">No encontrada</p>;

  const foto = pet.foto
    ? `${import.meta.env.VITE_BASE_URL}${pet.foto}`
    : "/default.png";

  // =========================================================
  // 🔥 NUEVA FUNCIÓN REAL → Usar toggleEncontrado del backend
  // =========================================================
  const handleToggle = async () => {
    try {
      setUpdating(true);

      // Llama al endpoint real /toggle-encontrado
      const updated = await toggleEncontrado(pet._id);

      // Se actualiza el estado en pantalla
      setPet(updated);
    } catch (err) {
      alert("Error al actualizar estado");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* HEADER — estilo instagram */}
      <div className="flex items-center gap-3 p-4 border-b">
        <img
          src="/avatar.png"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold">{pet.nombre}</h3>
          <p className="text-xs text-gray-500">Zona: {pet.zona}</p>
        </div>

        <div className="ml-auto">
          <Link to="/dashboard/lostpets" className="text-sm text-blue-500">
            Volver
          </Link>
        </div>
      </div>

      {/* FOTO GRANDE */}
      <img
        src={foto}
        className="w-full h-[480px] object-cover animate-fadeIn"
      />

      {/* INFO BAJO LA FOTO */}
      <div className="px-4 pb-6 pt-4">

        {/* Estado */}
        <p
          className={`font-bold mb-2 ${
            pet.encontrado ? "text-green-600" : "text-red-600"
          }`}
        >
          {pet.encontrado ? "Encontrado ✔" : "Aún perdido ❌"}
        </p>

        {/* Descripción estilo caption IG */}
        <p className="text-gray-700 leading-relaxed mb-3">
          <span className="font-semibold">{pet.nombre}: </span>
          {pet.descripcion}
        </p>

        {/* Contacto */}
        <p className="text-sm text-gray-500">
          📞 Contacto: {pet.contacto || "No registrado"}
        </p>

        {/* =======================================
            🔥 BOTÓN de cambiar estado (nuevo)
            Estilo Instagram, verde → rojo
        ======================================== */}
        <button
          onClick={handleToggle}
          disabled={updating}
          className={`mt-4 w-full py-2 rounded-lg text-white font-semibold ${
            pet.encontrado ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {updating
            ? "Actualizando..."
            : pet.encontrado
            ? "Marcar como NO encontrado"
            : "Marcar como encontrado"}
        </button>

        {/* Reacciones falsas estilo IG */}
        <div className="mt-4 flex gap-4 text-gray-600">
          <span>❤️ 13</span>
          <span>💬 4</span>
          <span>🔖</span>
        </div>

        {/* Navegación Siguiente / Anterior */}
        <div className="flex justify-between text-sm mt-6">
          <button
            className="text-blue-600"
            onClick={() => navigate(`/lostpets/${Number(id) - 1}`)}
          >
            ← Anterior
          </button>

          <button
            className="text-blue-600"
            onClick={() => navigate(`/lostpets/${Number(id) + 1}`)}
          >
            Siguiente →
          </button>
        </div>

      </div>
    </div>
  );
}
