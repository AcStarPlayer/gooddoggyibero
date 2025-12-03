// src/api/authService.js
import api from "../services/api";  // Usamos SOLO esta instancia

// ===========================================================
// 🔐 LOGIN
// ===========================================================
export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

// ===========================================================
// 🧾 REGISTER
// ===========================================================
export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

// ===========================================================
// 👤 PERFIL DEL USUARIO (requiere token JWT)
// ===========================================================
export const getProfile = async (token) => {
  const res = await api.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ===========================================================
// 🚪 LOGOUT (solo limpia almacenamiento local)
// ===========================================================
export const logoutUser = () => {
  localStorage.removeItem("token");
};
