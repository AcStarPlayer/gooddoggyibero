import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "@/services/events";
import { useToast } from "@/components/ui/use-toast";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const { toast } = useToast();

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      toast({ title: "Error cargando eventos" });
    }
  };

  const removeEvent = async (id) => {
    if (!confirm("¿Eliminar evento?")) return;

    try {
      await deleteEvent(id);
      toast({ title: "Evento eliminado" });
      loadEvents();
    } catch (err) {
      toast({ title: "Error al eliminar" });
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Eventos</h1>

        <Link to="create" className="px-4 py-2 bg-blue-600 text-white rounded">
          Crear Evento
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Título</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr key={e._id} className="border-b">
              <td className="p-3">{e.title}</td>
              <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
              <td className="p-3">{e.description}</td>

              <td className="p-3 flex gap-3">
                <Link to={`/admin/events/edit/${e._id}`} className="text-green-600">
                  Editar
                </Link>

                <button onClick={() => removeEvent(e._id)} className="text-red-500">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
