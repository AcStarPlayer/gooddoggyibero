import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function AdminDogsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    owner: "",
  });

  const loadDog = async () => {
    try {
      const res = await api.get(`/admin/dogs/${id}`);
      setForm(res.data);
    } catch {
      toast({ title: "Error cargando perro" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/dogs/${id}`, form);
      toast({ title: "Perro actualizado" });
      navigate("/admin/dogs");
    } catch {
      toast({ title: "Error al actualizar" });
    }
  };

  useEffect(() => {
    loadDog();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar perro</h1>

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
          className="input w-full p-2 border rounded"
          type="number"
          placeholder="Edad"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <input
          className="input w-full p-2 border rounded"
          placeholder="ID dueño (opcional)"
          value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value })}
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default AdminDogsEdit;
