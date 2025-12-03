// src/services/lostpets.js

import api from "./api"; // <--- IMPORTANTE

const BASE = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

// -----------------------------
// GET ALL LOST PETS
// -----------------------------
export const getLostPets = async (query = {}) => {
  const res = await api.get("/lostpets", { params: query });
  return res.data;
};

// -----------------------------
// GET ONE LOST PET
// -----------------------------
export const getLostPet = async (id) => {
  const res = await api.get(`/lostpets/${id}`);
  return res.data;
};

// -----------------------------
// CREATE LOST PET (con token automático)
// -----------------------------
export const createLostPet = async (data) => {
  const res = await api.post("/lostpets", data);
  return res.data;
};

// -----------------------------
// UPDATE LOST PET
// -----------------------------
export const updateLostPet = async (id, data) => {
  const res = await api.put(`/lostpets/${id}`, data);
  return res.data;
};

// -----------------------------
// DELETE LOST PET
// -----------------------------
export const deleteLostPet = async (id) => {
  const res = await api.delete(`/lostpets/${id}`);
  return res.data;
};

// -----------------------------
// TOGGLE “ENCONTRADO”
// -----------------------------
export const toggleEncontrado = async (id) => {
  const res = await api.post(`/lostpets/${id}/toggle-encontrado`);
  return res.data;
};
