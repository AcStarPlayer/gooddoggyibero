// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return <div className="p-8 text-center text-gray-600">Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // 🧠 Si hay roles permitidos y el usuario no cumple, redirige
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
