// 🧩 Modal (Dialog) liviano compatible con Tailwind
// No depende de librerías externas (Radix opcional)

import React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => onOpenChange(false)} // cerrar al hacer clic afuera
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // evita cerrar si clic dentro
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="border-b border-gray-200 pb-2 mb-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function DialogFooter({ className, children }) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)}>{children}</div>;
}
