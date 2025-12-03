import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function DogDetail({ dog, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <img
          src={`${import.meta.env.VITE_BASE_URL}${dog.foto}`}
          alt={dog.nombre}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h2 className="text-2xl font-bold">{dog.nombre}</h2>
        <p className="text-gray-600">Raza: {dog.raza || "Sin especificar"}</p>
        <p className="text-gray-600">Edad: {dog.edad || "N/A"}</p>
        <p className="mt-3">{dog.descripcion}</p>

        <Button className="mt-6 w-full" onClick={onClose}>
          Cerrar
        </Button>
      </motion.div>
    </motion.div>
  );
}
