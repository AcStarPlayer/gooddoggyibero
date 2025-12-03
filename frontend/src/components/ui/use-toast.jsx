// src/components/ui/use-toast.jsx
"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

// 🧩 Creamos un contexto global para el sistema de toasts
const ToastContext = createContext();

// 🧩 Identificador incremental de cada toast
let id = 0;

// 🔹 Hook personalizado para acceder al contexto
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de ToastProviderCustom");
  return context;
}

// 🔹 Proveedor global de notificaciones
export function ToastProviderCustom({ children }) {
  const [toasts, setToasts] = useState([]);

  // 🧩 Función para lanzar un nuevo toast
  const toast = useCallback((toastData) => {
    const newToast = { id: id++, ...toastData };
    setToasts((prev) => [...prev, newToast]);

    // 🕓 Eliminamos automáticamente el toast después de 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  }, []);

  // 🧩 Retornamos el proveedor con los valores del contexto
  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}
