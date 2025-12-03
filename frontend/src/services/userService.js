import api from "../services/api";

const API_URL = process.env.REACT_APP_API_URL;

// 🧬 Obtener perfil
export const getUserProfile = async (id, token) => {
  return await api.get(`${API_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ✏️ Actualizar perfil
export const updateUserProfile = async (id, data, token) => {
  return await axios.put(`${API_URL}/api/users/${id}`, data, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
};
