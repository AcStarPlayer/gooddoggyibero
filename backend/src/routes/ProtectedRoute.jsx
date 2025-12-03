import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Esperar mientras valida token en localStorage
  if (loading) return <div>Cargando...</div>;

  // ❌ No autenticado → ir a login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
