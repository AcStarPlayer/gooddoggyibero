// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (    
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-[#197c83] text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">GOOD DOGGY</h1>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 md:px-12 py-0">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">

          <div className="flex justify-center md:w-1/2 mb-10 md:mb-0">
            <img src={logo} alt="Good Doggy Logo" className="w-72 md:w-96 object-contain" />
          </div>

          <div className="md:w-1/2 w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 bg-white p-8 rounded-2xl shadow-md">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#197c83]"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#197c83]"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-full bg-[#b4d6d4] text-gray-800 font-semibold hover:bg-[#97c1be] transition-shadow shadow-md"
              >
                Ingresa
              </button>

              <p className="text-center text-sm text-gray-500 mt-2">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-[#197c83] font-semibold hover:underline">
                  Regístrate
                </Link>
              </p>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
