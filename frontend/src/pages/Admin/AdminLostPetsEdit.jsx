import { useEffect, useState } from "react";
import { getLostPet, updateLostPet } from "../../services/lostpets";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminLostPetsEdit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState("");
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const p = await getLostPet(id);
      setNombre(p.nombre);
      setCiudad(p.ciudad);
      setFecha(p.fecha);
    };
    cargar();
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("ciudad", ciudad);
    fd.append("fecha", fecha);
    if (imagen) fd.append("image", imagen);

    await updateLostPet(id, fd, token);
    navigate("/admin/lostpets");
  };

  return (
    <form onSubmit={guardar} className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Editar Mascota</h1>

      <input
        type="text"
        value={nombre}
        className="w-full border p-2"
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        value={ciudad}
        className="w-full border p-2"
        onChange={(e) => setCiudad(e.target.value)}
      />

      <input
        type="date"
        value={fecha}
        className="w-full border p-2"
        onChange={(e) => setFecha(e.target.value)}
      />

      <input type="file" onChange={(e) => setImagen(e.target.files[0])} />

      <button className="bg-blue-600 text-white p-2 rounded">
        Actualizar
      </button>
    </form>
  );
}
