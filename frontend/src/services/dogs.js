import axios from "axios";

//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = `${import.meta.env.VITE_BASE_URL}/api`;


// =====================================================
// 🐶 Obtener perro por ID
// =====================================================
export const getDogById = async (id, token) => {
  return await axios.get(`${API_URL}/dogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// =====================================================
// 🐶 Listar perros del usuario autenticado
// =====================================================
export const getMyDogs = async (token) => {
  return await axios.get(`${API_URL}/dogs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// =====================================================
// 🐶 Registrar perro con foto
// =====================================================
export const createDog = async (data, token) => {
  return await axios.post(`${API_URL}/dogs`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// =====================================================
// 🐶 Actualizar perro con o sin foto
// =====================================================
export const updateDog = async (id, data, token) => {
  return await axios.put(`${API_URL}/dogs/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// =====================================================
// 🐶 Eliminar perro
// =====================================================
export const deleteDog = async (id, token) => {
  return await axios.delete(`${API_URL}/dogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
