// ===============================================
// 👀 EditarMascota.jsx — Editar perro existente
// ===============================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DogForm from "@/components/DogForm";
import api from "../services/api";
import { motion } from "framer-motion";

export default function EditarMascota() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dogData, setDogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔄 Cargar datos del perro
  useEffect(() => {
    const fetchDog = async () => {
      try {
        const res = await api.get(`/dogs/${id}`);
        setDogData(res.data);
      } catch (err) {
        console.error("Error cargando perro:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  // 💾 Guardar cambios
  const handleUpdate = async (formData) => {
    if (saving) return;
    setSaving(true);

    try {
      await api.put(`/dogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/mis-mascotas"); // ⬅ redirigir después de guardar
    } catch (err) {
      console.error("Error actualizando perro:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Cargando datos...
      </div>
    );
  }

  if (!dogData) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        ❌ Mascota no encontrada
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DogForm
        initialData={dogData}
        onSubmit={handleUpdate}
        loading={saving}
        title="Editar Mascota"
      />
    </motion.div>
  );
}
