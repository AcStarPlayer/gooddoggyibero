// src/utils/auth.js
export const isAdmin = () => {
  const role = localStorage.getItem("role");
  return role === "admin";
};

export const getToken = () => {
  return localStorage.getItem("token");
};
