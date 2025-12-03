import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AdminDogs = () => {
  const [dogs, setDogs] = useState([]);
  const { toast } = useToast();

  const getDogs = async () => {
    try {
      const res = await api.get("/admin/dogs");
      setDogs(res.data);
    } catch (error) {
      toast({ title: "Error cargando perros" });
    }
  };

  const deleteDog = async (id) => {
    if (!confirm("¿Eliminar perro?")) return;
    try {
      await api.delete(`/admin/dogs/${id}`);
      toast({ title: "Perro eliminado" });
      getDogs();
    } catch {
      toast({ title: "Error al eliminar" });
    }
  };

  useEffect(() => {
    getDogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Perros Registrados</h1>

        <Link
          to="create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Registrar perro
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Raza</th>
            <th className="p-3">Edad</th>
            <th className="p-3">Dueño</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {dogs.map((d) => (
            <tr key={d._id} className="border-b">
              <td className="p-3">{d.name}</td>
              <td className="p-3">{d.breed}</td>
              <td className="p-3">{d.age}</td>
              <td className="p-3">{d.owner?.name ?? "Sin dueño"}</td>

              <td className="p-3 flex gap-3">
                <Link to={`/admin/dogs/${d._id}`} className="text-blue-600">
                  Ver
                </Link>
                <Link to={`/admin/dogs/edit/${d._id}`} className="text-green-600">
                  Editar
                </Link>
                <button
                  onClick={() => deleteDog(d._id)}
                  className="text-red-600"
                >
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

export default AdminDogs;
