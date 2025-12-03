// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import avatarImg from "../../assets/avatar.png";

export default function EditProfile({ onBack }) {
  const { user } = useAuth();
  const userId = user?._id;

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    ciudad: "",
    municipio: "",
    direccion: "",
    intereses: "",
  });

  const [preview, setPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // 1️⃣ Cargar datos del usuario
  // ======================================================
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!userId) return;

        const res = await api.get(`/users/${userId}`);
        const u = res.data;

        setFormData({
          name: u.name || "",
          lastname: u.lastname || "",
          ciudad: u.ciudad || "",
          municipio: u.municipio || "",
          direccion: u.direccion || "",
          intereses: u.intereses ? u.intereses.join(", ") : "",
        });

        // Foto inicial
        if (u.foto) {
          //setPreview(`${process.env.REACT_APP_API_URL}/uploads/${u.foto}`);
          //const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "").replace(/\/$/, "");
//setPreview(`${apiBase}${u.foto}`);
          setPreview(`${import.meta.env.VITE_BASE_URL}${u.foto}`);
        }
      } catch (err) {
        console.error("❌ Error cargando usuario:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // ======================================================
  // 2️⃣ Manejo de inputs
  // ======================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // 3️⃣ Manejo de imagen
  // ======================================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ======================================================
  // 4️⃣ Guardar cambios
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("lastname", formData.lastname);
      fd.append("ciudad", formData.ciudad);
      fd.append("municipio", formData.municipio);
      fd.append("direccion", formData.direccion);

      // Intereses como array
      fd.append(
        "intereses",
        JSON.stringify(
          formData.intereses
            ? formData.intereses.split(",").map((i) => i.trim())
            : []
        )
      );

      if (fotoFile) fd.append("foto", fotoFile);

      await api.put(`/users/${userId}`, fd);

      onBack(); // ← Regresa al perfil
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
      setError("No se pudo guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
        Editar Perfil
      </h2>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-3 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex justify-center">
          <img
            src={preview || avatarImg}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border"
          />
        </div>

        <div className="text-center">
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Nombre:</label>
          <input
            type="text"
            name="name"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Apellidos:</label>
          <input
            type="text"
            name="lastname"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.ciudad}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Municipio:</label>
          <input
            type="text"
            name="municipio"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.municipio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Dirección:</label>
          <input
            type="text"
            name="direccion"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Intereses:</label>
          <input
            type="text"
            name="intereses"
            placeholder="programación, cine, lectura"
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            value={formData.intereses}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            saving ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 underline"
        >
          ← Volver al perfil
        </button>
      </form>
    </div>
  );
}
