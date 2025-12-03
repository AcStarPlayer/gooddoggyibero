// 📍 src/hooks/useToast.js

// 🧩 Helper visual para lanzar toasts (notificaciones animadas)
import { useToast } from "@/components/ui/use-toast";

// 🧩 Este hook centraliza el uso del sistema de notificaciones
export default function useAppToast() {
  const { toast } = useToast();

  // 🧩 Función que recibe un mensaje y un tipo (success, error, default)
  const notify = (message, type = "default") => {
    toast({
      title:
        type === "success"
          ? "✅ Éxito"
          : type === "error"
          ? "❌ Error"
          : "ℹ️ Notificación",
      description: message,
      variant: type, // 🧩 Controla colores definidos en toast.js
    });
  };

  return notify; // 🧩 Retorna función lista para usar: notify("Texto", "success")
}
