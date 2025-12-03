import { useEffect, useState } from "react";
import { getVeterinarias, deleteVeterinaria } from "../../../services/veterinarias";
import { Link } from "react-router-dom";

export default function AdminVeterinarias() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await getVeterinarias();
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta veterinaria?")) return;
    await deleteVeterinaria(id);
    loadData();
  };

  return (
    <div>
      <h1>Veterinarias</h1>

      <Link to="create" className="btn btn-primary">Nueva veterinaria</Link>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(v => (
            <tr key={v._id}>
              <td>{v.nombre}</td>
              <td>{v.direccion}</td>
              <td>{v.telefono}</td>

              <td>
                <Link to={`edit/${v._id}`} className="btn btn-warning btn-sm">Editar</Link>
                <button onClick={() => handleDelete(v._id)} className="btn btn-danger btn-sm ms-2">
                  Eliminar
                </button>
                <Link to={v._id} className="btn btn-info btn-sm ms-2">Detalles</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
