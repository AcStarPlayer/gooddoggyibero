// src/api/lostPetsService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/lostpets";

// 🔹 Obtener todas las mascotas perdidas
export const getLostPets = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// 🔹 Registrar una nueva mascota (con imagen)
export const createLostPet = async (formData) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
