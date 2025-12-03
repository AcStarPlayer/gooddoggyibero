import { useState } from "react";
import { createLostPet } from "../../services/lostpets";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLostPetsCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState("");
  const [imagen, setImagen] = useState(null);

  const guardar = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("ciudad", ciudad);
    fd.append("fecha", fecha);
    fd.append("image", imagen);

    await createLostPet(fd, token);
    navigate("/admin/lostpets");
  };

  return (
    <form onSubmit={guardar} className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Nueva Mascota Perdida</h1>

      <input
        type="text"
        placeholder="Nombre"
        className="w-full border p-2"
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Ciudad"
        className="w-full border p-2"
        onChange={(e) => setCiudad(e.target.value)}
      />

      <input
        type="date"
        className="w-full border p-2"
        onChange={(e) => setFecha(e.target.value)}
      />

      <input type="file" onChange={(e) => setImagen(e.target.files[0])} />

      <button className="bg-green-600 text-white p-2 rounded">
        Guardar
      </button>
    </form>
  );
}
