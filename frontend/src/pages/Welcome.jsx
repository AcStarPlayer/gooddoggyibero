// src/pages/Welcome.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🐾 Imágenes
import logo from "../assets/logo.png";
import dog1 from "../assets/dog1.png";
import dog2 from "../assets/dog2.png";
import dog3 from "../assets/dog3.png";
import dog4 from "../assets/dog4.png";
import dog5 from "../assets/dog5.png";
import dog6 from "../assets/dog6.png";
import dog7 from "../assets/dog7.png";

// ✅ Importar pantallas reales
import Perfil from "./perfil/Perfil";
import EditarPerfil from "./perfil/EditarPerfil";
import MisMascotas from "./MisMascotas";
import RegistrarMascota from "./RegistrarMascota";
import Community from "./Community";
import VeterinariasList from "./VeterinariasList";
import Calendar from "./Calendar";
import LostPets from "./LostPets";
import LostPetCreate from "./LostPetCreate";
//import EditarPerfil from "./EditarPerfil";

// ✨ Animaciones
const sectionTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Welcome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("inicio");

  const dogs = [dog1, dog2, dog3, dog4, dog5, dog6, dog7];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoDashboard = () => {
    navigate("/dashboard"); // 🔹 Cambia si tu ruta del panel es otra
  };

  // 🔹 Render dinámico de secciones
  const renderSection = () => {
    switch (activeSection) {
      case "perfil":
        return <Perfil/>;
        //return (<Perfil userId={user?.id || user?._id} onEdit={() => setActiveSection("editar")} />);
      case "editar":
        return (<EditarPerfil userId={user?.id || user?._id} onBack={() => setActiveSection("perfil")}/>);
      case "doggys":
        return <MisMascotas setActiveSection={setActiveSection} />;
      case "agregarDoggy":
        return <RegistrarMascota setActiveSection={setActiveSection} />;
      case "directorio":
        return <VeterinariasList />;
      case "comunidad":
        return <Community />;
      case "calendario":
        return <Calendar />;
      case "doggyperdido":
        return <LostPets setActiveSection={setActiveSection} />;
      case "crearDoggyPerdido":
        return <LostPetCreate setActiveSection={setActiveSection} />;
      default:
        return (
          <>
            <motion.div
              className="grid grid-cols-4 gap-6 justify-items-center mb-10"
              initial="hidden"
              animate="visible"
            >
              {dogs.map((dog, index) => (
                <motion.img
                  key={index}
                  src={dog}
                  alt={`dog ${index + 1}`}
                  className="w-28 h-28"
                  variants={fadeInUp}
                  custom={index}
                />
              ))}
            </motion.div>
            <motion.h1
              className="text-2xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            >
              Bienvenido, ¡ayúdanos a construir comunidad!
            </motion.h1>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🟩 Header superior */}
      <header className="bg-[#127C87] flex justify-between items-center px-8 py-8 shadow-md">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Good Doggy Logo" className="w-20 h-20 rounded-full" />
          <h1 className="text-white text-3x1 font-bold tracking-wide">GOOD DOGGY</h1>
        </div>

        {/*<div className="flex items-center gap-4">*/}
          {/*<button*/}
            {/*onClick={handleGoDashboard}*/}
            {/*className="px-4 py-2 bg-white text-[#127C87] font-semibold rounded-lg shadow hover:bg-gray-100 transition"/}
          {/*>*/}
            {/*Ir al panel*/}
          {/*</button>*/}
          {/*<button*/}
            {/*onClick={handleLogout}*/}
            {/*className="px-4 py-2 bg-[#F59E0B] text-black font-semibold rounded-lg hover:bg-[#d48806] transition"
          {/*>*/}
            {/*Cerrar sesión*/}
          {/*</button>*/}
        {/*</div>*/}
      </header>

      <div className="flex flex-grow">
        {/* 🟧 Sidebar lateral */}
        <aside className="bg-[#F59E0B] w-64 text-black flex flex-col justify-between p-6 shadow-md">
          <nav>
            <ul className="space-y-6 font-semibold text-lg tracking-wide">
              {[
                ["perfil", "Mi Perfil"],
                ["doggys", "Doggys"],
                ["directorio", "Directorio"],
                ["comunidad", "Comunidad"],
                ["calendario", "Calendario"],
                ["doggyperdido", "Doggy perdido"],
              ].map(([key, label]) => (
                <li
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`cursor-pointer hover:underline transition-colors ${
                    activeSection === key ? "text-[#127C87]" : ""
                  }`}
                >
                  {label}
                </li>
              ))}
            </ul>
          </nav>
        {/* 🔸 Botón Cerrar Sesión al fondo */}
        <button
          onClick={handleLogout}
          className="text-black font-semibold hover:underline mt-6"
        >
          Cerrar sesión
        </button>
      </aside>
        {/* 🟦 Contenido principal con animaciones suaves */}
        {/*//<main className="flex-1 p-10 flex items-center justify-center bg-gray-100 overflow-hidden">*/}
          {/*//<AnimatePresence mode="wait">
            //<motion.div
              //key={activeSection}
              //variants={sectionTransition}
              //initial="initial"
              //animate="animate"
              //exit="exit"
              //className="w-full h-full flex items-center justify-center"
            //>
              //</AnimatePresence>{renderSection()}
            //</main></motion.div>
          //</div></AnimatePresence>
        //</main>     
      //</div>
    //</div>
  //);
//}*/}
        <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={sectionTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}