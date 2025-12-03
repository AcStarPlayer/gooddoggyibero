import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const VerPerro = ({ id, open, onClose }) => {
  const { token } = useAuth();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const fetchDog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDog(res.data);
      } catch (err) {
        console.error("❌ Error obteniendo mascota:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [open, id, token]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">Detalles de Mascota</h2>

        {/* Loading */}
        {loading && <p>Cargando...</p>}

        {/* Detalles */}
        {dog && (
          <div>
            {dog.foto && (
              <img
                src={dog.foto.startsWith("http") ? dog.foto : `${import.meta.env.VITE_API_URL}${dog.foto}`}
                alt={dog.nombre}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <p className="text-lg">
              <strong>Nombre:</strong> {dog.nombre}
            </p>
            <p>
              <strong>Raza:</strong> {dog.raza || "Sin especificar"}
            </p>
            <p>
              <strong>Edad:</strong> {dog.edad || "N/A"}
            </p>
            <p>
              <strong>Tamaño:</strong> {dog.tamano || "N/A"}
            </p>

            {dog.notas && (
              <p className="mt-3">
                <strong>Notas:</strong> {dog.notas}
              </p>
            )}

            <p className="text-gray-500 text-sm mt-4">
              Registrado el: {new Date(dog.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerPerro;
