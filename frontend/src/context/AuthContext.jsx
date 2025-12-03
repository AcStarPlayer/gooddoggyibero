// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();   // ✔ export nombrado único para contexto

const AuthProvider = ({ children }) => {       // ✔ componente como default export
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // 1️⃣ Validar token al cargar app
  // ======================================================
  useEffect(() => {
    const init = async () => {

      // 1️⃣ Cargar usuario desde localStorage si existe
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded._id;

        const res = await api.get(`/users/${userId}`);

        setUser(res.data);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", res.data.role);

      } catch (err) {
        console.error("❌ Token inválido o expirado:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ======================================================
  // 2️⃣ LOGIN
  // ======================================================
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;

    const decoded = jwtDecode(token);
    const userId = decoded._id;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", decoded.role);

    const profile = await api.get(`/users/${userId}`);
    setUser(profile.data.user || profile.data);

    return profile.data;
  };

  // ======================================================
  // 3️⃣ LOGOUT
  // ======================================================
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role: user?.role || localStorage.getItem("role"),
        isAdmin: (user?.role || localStorage.getItem("role")) === "admin",
        userId: user?._id || localStorage.getItem("userId"),
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;       // ✔ export default único

export const useAuth = () => useContext(AuthContext);   // ✔ ok, export nombrado adicional
