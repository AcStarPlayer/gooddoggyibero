// src/pages/AddLostPet.jsx
import React, { useState } from "react";
import { createLostPet } from "../services/lostpets";

export default function AddLostPet() {
  const [form, setForm] = useState({
    nombre: "", descripcion: "", tipo: "perro", color: "", zona: "", contacto: ""
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));
  const handleFile = (e) => setFoto(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("nombre", form.nombre);
      fd.append("descripcion", form.descripcion);
      fd.append("tipo", form.tipo);
      fd.append("color", form.color);
      fd.append("zona", form.zona);
      fd.append("contacto", form.contacto);
      if (foto) fd.append("foto", foto);

      const token = localStorage.getItem("token");
      await createLostPet(fd, token);
      alert("Reportado con éxito");
      // opcional: redirect o limpiar
      setForm({ nombre: "", descripcion: "", tipo: "perro", color: "", zona: "", contacto: "" });
      setFoto(null);
    } catch (err) {
      console.error(err);
      alert("Error al reportar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reportar mascota perdida</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="p-2 border rounded" />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="p-2 border rounded" />
        <div className="grid grid-cols-2 gap-2">
          <select name="tipo" value={form.tipo} onChange={handleChange} className="p-2 border rounded">
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
          <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="p-2 border rounded" />
        </div>
        <input name="zona" value={form.zona} onChange={handleChange} placeholder="Zona / barrio" className="p-2 border rounded" />
        <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto (tel / email)" className="p-2 border rounded" />
        <input type="file" accept="image/*" onChange={handleFile} />
        <button disabled={loading} className="bg-green-600 text-white py-2 rounded">{loading ? "Enviando..." : "Reportar"}</button>
      </form>
    </div>
  );
}
