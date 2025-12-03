import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function AdminDogsCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    owner: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/dogs", form);
      toast({ title: "Perro registrado" });
      navigate("/admin/dogs");
    } catch {
      toast({ title: "Error al registrar perro" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registrar perro</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input w-full p-2 border rounded"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input w-full p-2 border rounded"
          placeholder="Raza"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
        />

        <input
          type="number"
          className="input w-full p-2 border rounded"
          placeholder="Edad"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <input
          className="input w-full p-2 border rounded"
          placeholder="ID del dueño (opcional)"
          value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value })}
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default AdminDogsCreate;
