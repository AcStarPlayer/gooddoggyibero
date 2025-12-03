import { useState } from "react";
import { createVeterinaria } from "../services/veterinarias";

export default function VeterinariaForm() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    valorConsulta: "",
    calificacion: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createVeterinaria(form);
      alert("Veterinaria registrada");
      console.log(res);
    } catch (error) {
      console.error(error);
      alert("Error creando veterinaria");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-5 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Agregar Veterinaria</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          name="contacto"
          placeholder="Contacto"
          value={form.contacto}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="valorConsulta"
          type="number"
          placeholder="Valor consulta"
          value={form.valorConsulta}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="calificacion"
          type="number"
          min="1"
          max="5"
          placeholder="Calificación (1-5 estrellas)"
          value={form.calificacion}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-2 rounded-lg hover:bg-orange-600"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

