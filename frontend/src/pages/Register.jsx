import { useState } from "react";
import { registerUser } from "../api/authService";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // 👈 Asegúrate de tener tu logo en src/assets/logo.png

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    documentId: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await registerUser(form);
      setMessage(res.message || "Usuario registrado con éxito 🎉");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra superior */}
      <div className="bg-[#007C8A] h-16 flex justify-end items-center px-8">
        <h1 className="text-white text-2xl font-bold">GOOD DOGGY</h1>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row justify-center items-center flex-grow px-4 md:px-16 py-8">
        {/* Logo */}
        <div className="flex justify-center md:justify-end md:w-1/2 mb-8 md:mb-0">
          <img
            src={logo}
            alt="Good Doggy Logo"
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="md:w-1/2 max-w-md bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Regístrate
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField
              //label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
            />
            <InputField
              //label="Apellidos"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Apellidos"
            />
            <InputField
              //label="Documento de identidad"
              name="documentId"
              value={form.documentId}
              onChange={handleChange}
              placeholder="Documento de identidad"
            />
            <InputField
              //label="Dirección"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Dirección"
            />
            <InputField
              //label="Correo electrónico/usuario"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico/usuario"
            />
            <InputField
              //label="Teléfono"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Teléfono"
            />
            <InputField
              //label="Contraseña"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A9D6D2] hover:bg-[#86B8B5] text-gray-900 font-semibold py-2.5 rounded-full mt-4"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-[#007C8A] font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
