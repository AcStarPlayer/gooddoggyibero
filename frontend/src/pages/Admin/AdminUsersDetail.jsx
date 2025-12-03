import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const AdminUsersDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const res = await api.get(`/admin/users/${id}`);
    setUser(res.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Detalles del usuario</h1>

      <p><b>Nombre:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Rol:</b> {user.role}</p>
      <p><b>ID:</b> {user._id}</p>
    </div>
  );
};

export default AdminUsersDetail;
