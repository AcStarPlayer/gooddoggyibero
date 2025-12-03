{/* const API = import.meta.env.VITE_BASE_URL;

// Obtener veterinarias
export const getVeterinarias = async () => {
  const res = await fetch(`${API}/api/veterinarias`);
  return res.json();
};

// Crear veterinaria
export const createVeterinaria = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/api/veterinarias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// Reviews por veterinaria
export const getReviewsByVeterinaria = async (id) => {
  const res = await fetch(`${API}/api/veterinarias/${id}/reviews`);
  return res.json();
};*/}

// src/services/veterinarias.js
import api from "./api"; // tu instancia de Axios

export const getVeterinarias = () => api.get("/veterinarias");

export const getVeterinaria = (id) => api.get(`/veterinarias/${id}`);

export const createVeterinaria = (data) =>
  api.post("/veterinarias", data);

export const updateVeterinaria = (id, data) =>
  api.put(`/veterinarias/${id}`, data);

export const deleteVeterinaria = (id) =>
  api.delete(`/veterinarias/${id}`);

export const getReviewsByVeterinaria = async (id) => {
  const BASE = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${BASE}/api/veterinarias/${id}/reviews`);

  if (!res.ok) throw new Error("No se pudieron cargar los reviews");
  return res.json();
};