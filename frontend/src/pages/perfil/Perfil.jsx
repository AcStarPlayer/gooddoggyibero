import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EditarFoto from "./EditarFoto";

export default function Perfil() {
  const { user, setUser } = useAuth();

  // 🔵 NUEVO ESTADO: Lista de mascotas
  const [userDogs, setUserDogs] = useState([]);
  const [loadingDogs, setLoadingDogs] = useState(true);

  // Controlamos qué vista mostrar
  const [modo, setModo] = useState("vista"); 
  
  const [data, setData] = useState({
    name: "",
    lastname: "",
    direccion: "",
    municipio: "",
    ciudad: "",
    intereses: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [openFotoModal, setOpenFotoModal] = useState(false);

  // ---- LOAD USER PROFILE & DOGS ----
  useEffect(() => {
    const loadData = async () => {
      // 1. Cargar Perfil
      try {
        const res = await api.get(`/users/${user._id}`);

        setData({
          name: res.data.name || "",
          lastname: res.data.lastname || "",
          direccion: res.data.direccion || "",
          municipio: res.data.municipio || "",
          ciudad: res.data.ciudad || "",
          intereses: res.data.intereses?.join(", ") || "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }

      // 2. 🔵 NUEVO: Cargar Mascotas
      try {
        setLoadingDogs(true);
        // ASUME que tienes un endpoint para listar las mascotas del usuario
        // Por ejemplo: /dogs/user/:userId
        //const dogsRes = await api.get(`/dogs/user/${user._id}`);
        const dogsRes = await api.get(`/dogs`);
        setUserDogs(dogsRes.data);
      } catch (err) {
        console.error("Error cargando mascotas:", err);
        setUserDogs([]); // En caso de error, la lista queda vacía
      } finally {
        setLoadingDogs(false);
      }
    };

    loadData();
  }, [user]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await api.put(`/users/${user._id}`, data);
      setUser(res.data.user);

      setMsg({ type: "success", text: "Perfil actualizado correctamente." });

      setModo("vista");
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Error al guardar cambios.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- CAMBIO PASSWORD ----
  const [pass, setPass] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

  const changePassword = async () => {
    if (!pass.newPassword || pass.newPassword.length < 6) {
      return setMsg({
        type: "error",
        text: "La contraseña debe tener mínimo 6 caracteres.",
      });
    }

    setLoadingPass(true);

    try {
      const res = await api.put(`/users/change-password/${user._id}`, pass);

      setMsg({ type: "success", text: res.data.message });
      setPass({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Error al cambiar contraseña.",
      });
    } finally {
      setLoadingPass(false);
    }
  };

  // ===============================================================
  //    🔵 LÓGICA DE VISUALIZACIÓN DE MASCOTAS
  // ===============================================================
    const renderDogsSummary = () => {
        if (loadingDogs) {
            return "Cargando mascotas...";
        }

        const count = userDogs.length;
        if (count === 0) {
            return "Aún no tienes mascotas registradas.";
        }

        // Obtener solo los nombres de las mascotas
        const dogNames = userDogs.map(dog => dog.nombre || dog.name); 
        const namesList = dogNames.join(" y "); // Conectar los nombres con "y"

        const tutorText = count === 1 ? `Tutor de 1 perro:` : `Tutor de ${count} perros:`;
        
        return (
            <>
                <span className="font-semibold">{tutorText}</span> {namesList}
            </>
        );
    }
    
  // ===============================================================
  //    🔵 VISTA "RESUMIDA" (como la imagen)
  // ===============================================================
  if (modo === "vista") {

    console.log("FOTO DEL USER:", user.foto);
    console.log("URL COMPLETA:", `${import.meta.env.VITE_BASE_URL}${user.foto}`);


    return (
      <div className="w-full bg-white p-10 flex justify-between">
        
        {/* IZQUIERDA */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>

          <p className="text-lg font-semibold">
            {data.name} {data.lastname}
          </p>

          <p className="mt-4 text-gray-700">
            {/* 🔄 CAMBIO: Mostrar la info real de las mascotas */}
            {renderDogsSummary()}
          </p>

          <p className="mt-6 text-gray-800 whitespace-pre-line">
            <strong>Ubicacion:</strong> {data.direccion} – {data.ciudad}
            {"\n"}
            <strong>Intereses:</strong> {data.intereses}
          </p>

          <button
            onClick={() => setModo("editar")}
            className="mt-8 px-5 py-2 bg-[#127C87] text-white rounded-lg hover:bg-[#0f6670]"
          >
            Editar perfil
          </button>
        </div>

        {/* DERECHA (FOTO) */}
        <div className="flex items-start">
          <img
            src={
                user.foto
                  //? `${import.meta.env.VITE_API_URL.replace('/api', '')}${user.foto}` para la prueba de vite lo comentamos
                  ? `${import.meta.env.VITE_BASE_URL}${user.foto}`
                  : "/default.png"
            }    
            className="w-40 h-40 rounded-full shadow object-cover"
          />
        </div>
      </div>
    );
  }

  // ===============================================================
  //   🔵 MODO "EDITAR" → Tu código ORIGINAL (solo envuelto)
  // ===============================================================
  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* Botón REGRESAR */}
      <button
        onClick={() => setModo("vista")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver a mi perfil
      </button>

      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>

      {/* FOTO */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.foto
            ? `${import.meta.env.VITE_BASE_URL}${user.foto}`
                  : "/default.png"
          }
          alt="perfil"
          className="w-28 h-28 object-cover rounded-full shadow"
        />
        <button
          onClick={() => setOpenFotoModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cambiar foto
        </button>
      </div>

      {/* MENSAJE */}
      {msg.text && (
        <div
          className={`mb-4 p-2 rounded text-sm ${
            msg.type === "error"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* FORMULARIO (TU CÓDIGO ORIGINAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-semibold">Nombre</label>
          <input
            className="w-full border p-2 rounded"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-semibold">Apellido</label>
          <input
            className="w-full border p-2 rounded"
            name="lastname"
            value={data.lastname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-semibold">Dirección</label>
          <input
            className="w-full border p-2 rounded"
            name="direccion"
            value={data.direccion}
            onChange={handleChange}
          />
          </div>

          <div>
            <label className="font-semibold">Municipio</label>
            <input
              className="w-full border p-2 rounded"
              name="municipio"
              value={data.municipio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-semibold">Ciudad</label>
            <input
              className="w-full border p-2 rounded"
              name="ciudad"
              value={data.ciudad}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold">Intereses</label>
            <input
              className="w-full border p-2 rounded"
              name="intereses"
              value={data.intereses}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {/* CONTRASEÑA (TU CÓDIGO ORIGINAL) */}

        {/*<h2 className="text-xl font-bold mt-10 mb-3">Cambiar contraseña</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold">Contraseña actual</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={pass.oldPassword}
              onChange={(e) =>
                setPass({ ...pass, oldPassword: e.target.value })
              }
            />
          </div>
          <div>
            <label className="font-semibold">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={pass.newPassword}
              onChange={(e) =>
                setPass({ ...pass, newPassword: e.target.value })
              }
            />
          </div>
        </div>
        <button
          onClick={changePassword}
          disabled={loadingPass}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loadingPass ? "Cambiando..." : "Cambiar contraseña"}
        //</button>*/}

        {/* MODAL FOTO */}
        {openFotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <EditarFoto
                onClose={() => setOpenFotoModal(false)}
                onUpdated={(u) => setUser(u)}
              />
            </div>
          </div>
        )}
      </div>
  );
}
