import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
//import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error cargando usuarios" });
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: "Usuario eliminado" });
      getUsers();
    } catch (error) {
      toast({ title: "Error al eliminar" });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link to="create" className="btn bg-blue-500 text-white px-4 py-2 rounded">
          Crear usuario
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 flex gap-3">
                <Link to={`/admin/users/${u._id}`} className="text-blue-600">Ver</Link>
                <Link to={`/admin/users/edit/${u._id}`} className="text-green-600">Editar</Link>
                <button onClick={() => deleteUser(u._id)} className="text-red-600">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
