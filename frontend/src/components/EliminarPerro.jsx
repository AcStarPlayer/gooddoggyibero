import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const EliminarPerro = ({ id, open, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/dogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(); // refrescar lista
      onClose(); // cerrar modal
    } catch (err) {
      console.error("❌ Error eliminando perro:", err);
      alert("Error eliminando mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">¿Eliminar mascota?</h2>
        <p className="mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarPerro;
