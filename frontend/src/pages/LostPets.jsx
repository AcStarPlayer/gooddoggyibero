// src/pages/LostPets.jsx
import React, { useEffect, useState } from "react";
import { getLostPets } from "../services/lostpets";
import LostPetCard from "../components/LostPetCard";

// 🔹 Recibimos setActiveSection desde Welcome.jsx
export default function LostPets({ setActiveSection }) {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getLostPets();
      setList(data);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mascotas perdidas</h1>

      {/* 🔹 Navegación interna hacia el formulario */}
      <button
        onClick={() => setActiveSection("crearDoggyPerdido")}
        className="block w-full bg-teal-600 text-white text-center p-2 rounded-xl mb-4 shadow hover:bg-teal-700 transition"
      >
        Publicar Mascota Perdida
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid gap-4">
          {list.length === 0 ? (
            <p>No hay reportes.</p>
          ) : (
            list.map((p) => (
              <LostPetCard
                key={p._id}
                pet={p}
                onDeleted={(id) =>
                  setList(list.filter((item) => item._id !== id))
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
