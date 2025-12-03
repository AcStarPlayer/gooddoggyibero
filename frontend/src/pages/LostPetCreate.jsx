// src/pages/LostPetCreate.jsx
import React, { useState } from "react";
import { createLostPet } from "../services/lostpets";

export default function LostPetCreate({ setActiveSection }) {
  // 🔹 Recibimos setActiveSection desde Welcome.jsx para navegación interna SIN rutas

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    zona: "",
    tipo: "perro",
  });

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Actualización normal de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Manejo de foto con preview tipo Instagram
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔹 Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || !form.zona || !foto) {
      alert("Todos los campos son obligatorios, incluida la foto.");
      return;
    }

    const fd = new FormData();
    fd.append("nombre", form.nombre);
    fd.append("descripcion", form.descripcion);
    fd.append("zona", form.zona);
    fd.append("tipo", form.tipo);
    fd.append("foto", foto);

    setLoading(true);

    try {
      await createLostPet(fd);

      // 🔹 Navegación interna: volver a la lista
      setActiveSection("doggyperdido");

    } catch (err) {
      console.error(err);
      alert("Error creando la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Publicar Mascota Perdida
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* FOTO PRINCIPAL ESTILO INSTAGRAM */}
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-56 h-56 object-cover rounded-xl shadow-md border"
              />
            ) : (
              <div className="w-56 h-56 bg-gray-200 flex items-center justify-center rounded-xl border shadow-inner text-gray-500">
                Toca para subir foto
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
          </label>
        </div>

        {/* CAMPOS */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la mascota"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:ring-teal-200"
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:ring-teal-200"
        />

        <input
          type="text"
          name="zona"
          placeholder="Zona donde se perdió"
          value={form.zona}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:ring-teal-200"
        />

        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:ring-teal-200"
        >
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        {/* BOTÓN INSTAGRAM */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white p-3 rounded-xl shadow-md hover:bg-teal-700 transition font-semibold text-lg"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}
