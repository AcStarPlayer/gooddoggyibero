// =====================================================
// 🌐 api.js — Axios configurado para GoodDoggy
// =====================================================

import axios from "axios";

// 🧩 URL base del backend (Vite usa import.meta.env)
//const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = `${import.meta.env.VITE_BASE_URL}/api`;
//console.log("API_URL:", baseURL);
console.log("BASE_URL:", baseURL);

// =====================================================
// 🚀 Instancia principal de Axios
// =====================================================
const api = axios.create({
  baseURL,
});

// =====================================================
// 🎫 Interceptor de solicitudes
// Inserta automáticamente el JWT en Authorization
// =====================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ❗ Importante:
  // NUNCA forzamos multipart, ni JSON.
  // Axios detecta solo el Content-Type (especialmente FormData)
  return config;
});

// =====================================================
// ⚠ Interceptor de respuestas — Manejo elegante de errores
// =====================================================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Token expirado o inválido
    if (error.response?.status === 401) {
      console.warn("⚠ Token expirado o inválido. Redirigiendo a login...");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Error de red
    if (error.code === "ERR_NETWORK") {
      console.error("🌐 Error de red o backend apagado.");
    }

    return Promise.reject(error);
  }
);

export const BASE_URL = baseURL;  // <-- FALTABA ESTO

export default api;
