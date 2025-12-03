import { useEffect, useState } from "react";
import { getLostPet } from "../../services/lostpets";
import { useParams } from "react-router-dom";

export default function AdminLostPetsDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    getLostPet(id).then(setPet);
  }, [id]);

  if (!pet) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">{pet.nombre}</h1>

      <img src={pet.imageUrl} className="w-full rounded" />

      <p><b>Ciudad:</b> {pet.ciudad}</p>
      <p><b>Fecha:</b> {pet.fecha}</p>

      <p className="text-gray-500 mt-4">
        ID registro: {pet._id}
      </p>
    </div>
  );
}
