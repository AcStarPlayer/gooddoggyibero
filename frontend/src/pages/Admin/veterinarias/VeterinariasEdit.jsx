import { useEffect, useState } from "react";
import { getVeterinaria, updateVeterinaria } from "../../../services/veterinarias";
import VetForm from "../../../components/admin/veterinarias/VetForm";
import { useNavigate, useParams } from "react-router-dom";

export default function VeterinariasEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    direccion: "",
    telefono: ""
  });

  useEffect(() => {
    const load = async () => {
      const res = await getVeterinaria(id);
      setValues(res.data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateVeterinaria(id, values);
    navigate("/admin/veterinarias");
  };

  return (
    <div>
      <h1>Editar Veterinaria</h1>
      <VetForm
        values={values}
        setValues={setValues}
        onSubmit={handleSubmit}
        buttonText="Guardar cambios"
      />
    </div>
  );
}
