import React, { useState } from "react";
import api from "../../services/api";
//import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

//const AdminUsersCreate = () => {
  //const navigate = useNavigate();
  //const [form, setForm] = useState({
    //name: "",
    //email: "",
    //password: "",
    //role: "user",
  //});

function AdminUsersCreate() {
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", form);
      toast({ title: "Usuario creado" });
      navigate("/admin/users");
    } catch (error) {
      toast({ title: "Error creando usuario" });
    }
  };

  toast({
  title: "Usuario creado",
  description: "El usuario fue registrado correctamente",
});

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Crear usuario</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input type="email" placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input type="password" placeholder="Contraseña"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <button className="btn bg-blue-500 text-white">Crear</button>
      </form>
    </div>
  );
};

export default AdminUsersCreate;
