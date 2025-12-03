import React from "react";
import DogForm from "../components/DogForm";
import { createDog } from "../services/dogs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RegistrarMascota({ setActiveSection }) {

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Debes iniciar sesión");
        return;
      }

      const res = await createDog(formData, token);

      console.log("Perro registrado:", res.data);

      // 🔥 REGRESA AUTOMÁTICAMENTE A DOGGYS
      setActiveSection("doggys");
    } catch (err) {
      console.error("Error creando perro:", err);
      alert("Hubo un error al registrar la mascota");
    }
  };

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔙 BOTÓN REGRESAR */}
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setActiveSection("doggys")}
      >
        ⬅ Regresar
      </Button>

      <h2 className="text-3xl font-bold mb-6">Registrar Mascota</h2>

      <DogForm onSubmit={handleSubmit} />
    </motion.div>
  );
}

