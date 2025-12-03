import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function AdminUsersEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const loadUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setForm(res.data);
    } catch (error) {
      toast({
        title: "Error al cargar usuario",
        description: "No se pudo obtener la información del usuario.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${id}`, form);

      toast({
        title: "Usuario actualizado",
        description: "Los datos se guardaron correctamente",
      });

      navigate("/admin/users");
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "Hubo un problema al guardar los cambios.",
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar usuario</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input w-full p-2 border rounded"
          value={form.name}
          placeholder="Nombre"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input w-full p-2 border rounded"
          value={form.email}
          placeholder="Correo"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="input w-full p-2 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          type="submit"
          className="btn bg-green-500 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default AdminUsersEdit;
