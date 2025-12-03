// 📁 src/utils/auth.js

// ✅ Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem("token") || "";
};

// ✅ Obtener datos del usuario (si los guardas al hacer login)
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ Verificar si el usuario es admin
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin"; // asegúrate de que tu backend incluya "role" en el JWT
};
