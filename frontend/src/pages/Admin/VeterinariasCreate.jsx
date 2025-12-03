import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function VeterinariasCreate() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    valorConsulta: "",
    calificacion: "5",
  });

  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        valorConsulta: Number(form.valorConsulta),
        calificacion: Number(form.calificacion),
      };

      await api.post("/veterinarias", payload);

      nav("/admin/veterinarias");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Veterinaria</h1>

      <form onSubmit={submit} className="grid gap-6 bg-white p-6 shadow rounded">
        <input name="nombre" onChange={change} required className="p-2 border rounded" placeholder="Nombre" />

        <input name="direccion" onChange={change} required className="p-2 border rounded" placeholder="Dirección" />

        <input name="contacto" onChange={change} className="p-2 border rounded" placeholder="Contacto" />

        <input
          type="number"
          name="valorConsulta"
          onChange={change}
          className="p-2 border rounded"
          min="0"
          placeholder="Valor de consulta"
        />

        <input
          type="number"
          name="calificacion"
          onChange={change}
          className="p-2 border rounded"
          min="1"
          max="5"
          placeholder="Calificación"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
