import { useState } from "react";
import { createVeterinaria } from "../../../services/veterinarias";
import VetForm from "../../../components/admin/veterinarias/VetForm";
import { useNavigate } from "react-router-dom";

export default function VeterinariasCreate() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nombre: "",
    direccion: "",
    telefono: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createVeterinaria(values);
    navigate("/admin/veterinarias");
  };

  return (
    <div>
      <h1>Nueva Veterinaria</h1>
      <VetForm
        values={values}
        setValues={setValues}
        onSubmit={handleSubmit}
        buttonText="Crear"
      />
    </div>
  );
}