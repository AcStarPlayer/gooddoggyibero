// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  // Si NO hay token → mandar al login
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
