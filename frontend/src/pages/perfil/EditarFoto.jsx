import React, { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function EditarFoto({ onClose, onUpdated }) {
  const { user, setUser } = useAuth();

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación simple
    if (!file.type.startsWith("image/")) {
      return setMsg({ type: "error", text: "Debes seleccionar una imagen válida." });
    }

    if (file.size > 5 * 1024 * 1024) {
      return setMsg({ type: "error", text: "La imagen no debe superar 5MB." });
    }

    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setMsg({ type: "", text: "" });
  };

  const handleUpload = async () => {
    if (!foto) {
      return setMsg({ type: "error", text: "Selecciona una imagen primero." });
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("foto", foto);
      console.log("📤 Enviando foto al backend:", foto);

      const res = await api.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}`,},
      });
      
      console.log("📥 Respuesta backend:", res.data);

      // Actualiza global auth user
      const updatedUser = res.data.user;

      if (!updatedUser) {
        console.log("❌ ERROR: El backend NO devolvió user");
      }

      console.log("🖼 Nueva URL de foto:", updatedUser?.foto);

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMsg({ type: "success", text: "Foto actualizada correctamente." });

      // Refrescar parent
      if (onUpdated) onUpdated(updatedUser);

      // Cerrar modal después de 1s
      setTimeout(() => {
        onClose && onClose();
      }, 900);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Error al subir la foto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Actualizar foto de perfil</h2>

      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden shadow">
          <img
            src={
                preview || 
                (user.foto
                  //? `${import.meta.env.VITE_FILES_URL}${user.foto}`
                  //? `${import.meta.env.VITE_API_URL}${user.foto}`
                  //: "/default.png")
                  //? `${import.meta.env.VITE_API_URL.replace('/api', '')}${user.foto}` se comento para la variable vite
                  ? `${import.meta.env.VITE_BASE_URL}${user.foto}`
                  : "/default.png")
                
            }
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="mb-3"
        />

        {msg.text && (
          <div
            className={`mb-3 text-sm ${
              msg.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {msg.text}
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Subiendo..." : "Actualizar foto"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
