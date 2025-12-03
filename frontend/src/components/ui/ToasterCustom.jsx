"use client"; // ✅ Necesario si usas Next.js, no afecta en Vite o CRA

import React from "react";
import { useToast } from "@/components/ui/use-toast";

/* ===========================================================
   🔔 COMPONENTE: ToasterCustom
   - Se encarga de mostrar los toasts activos en pantalla.
   - Usa el contexto de "useToast" para escuchar los toasts
     generados en cualquier parte de la app.
=========================================================== */

export function ToasterCustom() {
  // Extrae la lista de toasts desde el contexto global
  const { toasts } = useToast();

  // Si no hay notificaciones activas, no renderiza nada
  if (!toasts.length) return null;

  return (
    /* 📍 Posición fija (arriba a la derecha de la pantalla) */
    <div className="fixed top-4 right-4 space-y-3 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          /* 🎨 Clases condicionales según el tipo de notificación */
          className={`toast-enter px-4 py-3 rounded-lg shadow-md text-white transition-all duration-300 ${
            t.variant === "success"
              ? "bg-green-600" // Éxito
              : t.variant === "error"
              ? "bg-red-600"   // Error
              : t.variant === "warning"
              ? "bg-yellow-500 text-black" // Advertencia
              : "bg-blue-600"  // Info o default
          }`}
        >
          {/* 🧱 Título del toast */}
          <h3 className="font-semibold">{t.title}</h3>

          {/* 📝 Descripción opcional */}
          {t.description && <p className="text-sm">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   📌 NOTAS IMPORTANTES
   - Este componente debe estar incluido una sola vez en tu App.jsx
     dentro del proveedor <ToastProviderCustom>.

   Ejemplo:
   -------------------------------------------
   <ToastProviderCustom>
     <BrowserRouter>
       <ToasterCustom />  ← Aquí
     </BrowserRouter>
   </ToastProviderCustom>
   -------------------------------------------

   - Las animaciones (.toast-enter / .toast-exit) 
     vienen desde tu index.css
=========================================================== */
