import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const EditarFoto = () => {
  const { user, token, updateUser } = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Cargando...</p>;

  // =====================================================
  // 📸 Manejar selección de archivo
  // =====================================================
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  // =====================================================
  // 📤 Enviar foto al backend
  // PUT /api/users/:id  (campo: "foto")
  // =====================================================
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona una foto primero");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("foto", file);

      const res = await api.put(`/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // 🔄 Actualizar usuario en AuthContext
      updateUser(res.data.user);

      alert("Foto actualizada correctamente.");
    } catch (err) {
      console.error("❌ Error al subir foto:", err);
      alert("Error al actualizar la foto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Actualizar Foto de Perfil</h1>

      <div className="mb-4">
        <img
          src={user.foto ? `${import.meta.env.VITE_API_URL}${user.foto}` : "/img/default-avatar.png"}
          alt="Foto actual"
          className="w-40 h-40 object-cover rounded-full mx-auto mb-3"
        />
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Subiendo..." : "Actualizar foto"}
        </button>
      </form>
    </div>
  );
};

export default EditarFoto;
