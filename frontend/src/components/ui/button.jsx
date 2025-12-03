// 🧩 Componente de botón reutilizable
// Compatible con Tailwind, acepta clases personalizadas y eventos como onClick

import React from "react";
import { cn } from "@/lib/utils"; // combina clases condicionalmente

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "bg-blue-600 hover:bg-blue-700 text-white", // color base
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
