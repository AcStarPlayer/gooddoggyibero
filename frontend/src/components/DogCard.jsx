// src/components/DogCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DogCard({ dog }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <img
            src={
              dog.foto
                ? `${import.meta.env.VITE_BASE_URL}${dog.foto}`
                : "/dog-placeholder.png"
            }
            alt={dog.nombre}
            className="w-full h-48 object-cover"
          />
        </CardContent>

        <div className="p-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <PawPrint size={18} /> {dog.nombre}
          </h3>

          <p className="text-gray-600">Raza: {dog.raza || "Sin especificar"}</p>
          <p className="text-gray-600">Edad: {dog.edad || "N/A"}</p>

          <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {dog.descripcion}
          </p>

          <Button
            className="mt-4 w-full"
            onClick={() => navigate(`/mis-mascotas/editar/${dog._id}`)}
          >
            Editar Mascota
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
