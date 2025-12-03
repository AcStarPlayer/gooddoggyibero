import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLostPets, deleteLostPet } from "../../services/lostpets";
import { Link } from "react-router-dom";

export default function AdminLostPets() {
  const { token } = useAuth();
  const [lostpets, setLostPets] = useState([]);

  const cargar = async () => {
    try {
      const data = await getLostPets();
      setLostPets(data);
    } catch (error) {
      console.error("Error cargando mascotas perdidas", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta mascota perdida?")) return;
    await deleteLostPet(id, token);
    cargar();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Mascotas Perdidas</h1>
        <Link
          to="create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nueva Mascota Perdida
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Foto</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Ciudad</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lostpets.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-2">
                <img className="h-12 w-12 rounded object-cover" src={p.imageUrl} />
              </td>
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.ciudad}</td>
              <td className="p-2">{p.fecha}</td>
              <td className="p-2 flex gap-2">
                <Link
                  to={`${p._id}`}
                  className="text-blue-600 underline"
                >
                  Ver
                </Link>
                <Link
                  to={`edit/${p._id}`}
                  className="text-yellow-600 underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => eliminar(p._id)}
                  className="text-red-600 underline"
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
}
