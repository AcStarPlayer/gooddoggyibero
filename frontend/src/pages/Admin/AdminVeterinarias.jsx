import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminVeterinarias() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    //const { data } = await api.get("/api/veterinarias");
    const { data } = await api.get("/veterinarias");
    setList(data);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar veterinaria?")) return;
    //await api.delete(`/api/veterinarias/${id}`);
    await api.delete(`/veterinarias/${id}`);
    setList(list.filter(v => v._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Veterinarias</h1>

      <Link 
        to="/admin/veterinarias/create"
        className="px-4 py-2 bg-teal-600 text-white rounded shadow"
      >
        Registrar veterinaria
      </Link>

      <table className="w-full mt-8 bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-3">Nombre</th>
            <th className="p-3">Dirección</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(v => (
            <tr key={v._id} className="border-b">
              <td className="p-3">{v.nombre}</td>
              <td className="p-3">{v.direccion}</td>
              <td className="p-3 space-x-3">
                <Link to={`/admin/veterinarias/edit/${v._id}`} className="text-blue-600">Editar</Link>
                <button onClick={() => eliminar(v._id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
