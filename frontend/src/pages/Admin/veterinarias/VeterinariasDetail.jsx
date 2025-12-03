import { useEffect, useState } from "react";
import { getVeterinaria } from "../../../services/veterinarias";
import { useParams } from "react-router-dom";

export default function VeterinariasDetail() {
  const { id } = useParams();
  const [vet, setVet] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getVeterinaria(id);
      setVet(res.data);
    };
    load();
  }, [id]);

  if (!vet) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{vet.nombre}</h1>
      <p><strong>Dirección:</strong> {vet.direccion}</p>
      <p><strong>Teléfono:</strong> {vet.telefono}</p>
    </div>
  );
}
