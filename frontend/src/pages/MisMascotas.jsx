// ============================================================
// 🐶 MisMascotas.jsx — versión tuya + agregado ELIMINAR completo
// ============================================================

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { getMyDogs, deleteDog } from "../services/dogs";   // ⬅️ IMPORTANTE
import DogDetail from "./DogDetail";

export default function MisMascotas({ setActiveSection }) {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⬅️ Estado para mostrar detalle
  const [selectedDog, setSelectedDog] = useState(null);

  // ============================================================
  // 📌 Obtener mascotas del usuario
  // ============================================================
  const fetchDogs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No se encontró token. Usuario no autenticado.");
        return;
      }

      const res = await getMyDogs(token);
      console.log("➡️ Respuesta de perros:", res.data);

      setDogs(res.data);
    } catch (err) {
      console.error("Error obteniendo perros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  // ============================================================
  // 🗑️ ELIMINAR PERRO — FALTABA EN TU CÓDIGO (AQUÍ ESTÁ COMPLETO)
  // ============================================================
  const handleDelete = async (dogId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta mascota?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await deleteDog(dogId, token);

      // 🔄 Recargar listado
      fetchDogs();
    } catch (err) {
      console.error("❌ Error eliminando perro:", err);
      alert("Error eliminando la mascota.");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl">
        Cargando...
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <PawPrint /> Mis Mascotas
      </h2>

      {/* Botón Registrar */}
      <div className="mb-6">
        <Button
          onClick={() => setActiveSection("agregarDoggy")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          ➕ Registrar nueva mascota
        </Button>
      </div>

      {/* No hay perros */}
      {dogs.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No tienes perros registrados aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {dogs.map((dog) => (
            <motion.div
              key={dog._id}
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
                  <h3 className="text-xl font-semibold">{dog.nombre}</h3>
                  <p className="text-gray-600">
                    Raza: {dog.raza || "Sin especificar"}
                  </p>
                  <p className="text-gray-600">Edad: {dog.edad || "N/A"}</p>
                  <p className="mt-2 text-gray-700 text-sm">
                    {dog.descripcion}
                  </p>

                  {/* Ver más */}
                  <Button
                    className="mt-4 w-full"
                    onClick={() => setSelectedDog(dog)}
                  >
                    Ver más
                  </Button>

                  {/* ========================== */}
                  {/* 🗑️ ELIMINAR */}
                  {/* ========================== */}
                  <Button
                    className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(dog._id)}   // ✔️ AHORA ESTÁ DEFINIDO
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selectedDog && (
        <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} />
      )}
    </div>
  );
}
