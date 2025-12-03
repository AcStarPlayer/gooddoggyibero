// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function ChangePassword({ onBack }) {
  const userId = localStorage.getItem("userId");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) return setError("Todos los campos son obligatorios.");
    if (newPassword.length < 6) return setError("La nueva contraseña debe tener mínimo 6 caracteres.");
    if (newPassword !== confirmPassword) return setError("Las contraseñas no coinciden.");

    try {
      setLoading(true);
      await api.put(`/users/change-password/${userId}`, { oldPassword, newPassword });
      setSuccess("Contraseña cambiada correctamente ✔");
      setTimeout(() => onBack(), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">Cambiar Contraseña</h2>
      {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-3 text-sm">{error}</p>}
      {success && <p className="bg-green-100 text-green-600 p-3 rounded-lg mb-3 text-sm">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-gray-700 font-medium">Contraseña Actual:</label>
          <input type="password" className="w-full mt-1 border px-4 py-2 rounded-lg" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Nueva Contraseña:</label>
          <input type="password" className="w-full mt-1 border px-4 py-2 rounded-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Confirmar Nueva Contraseña:</label>
          <input type="password" className="w-full mt-1 border px-4 py-2 rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg text-white font-semibold ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}>
          {loading ? "Guardando..." : "Cambiar Contraseña"}
        </button>

        <button type="button" onClick={onBack} className="w-full mt-3 text-gray-600 hover:text-gray-800 underline">← Volver al perfil</button>
      </form>
    </div>
  );
}
