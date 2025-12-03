import { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  
  // Cargar datos desde localStorage al iniciar
  const storedProfile = JSON.parse(localStorage.getItem("profile"));

  const [profile, setProfile] = useState(
    storedProfile || {
      foto: "/avatar.png",
      nombre: "Alex",
      apellido: "Trotamundos",
      ciudad: "Cúcuta",
      sector: "Atalaya",
      intereses: "Parques pet friendly – Cuidado Animal – Veterinarias",
    }
  );

  // 🧡 Guardar automáticamente en localStorage cada vez que el perfil cambie
  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newData) => {
    setProfile((prev) => ({ ...prev, ...newData }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
