import React, { useEffect, useState } from "react";
import { getEvent, updateEvent } from "@/services/events";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AdminEventsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  const loadEvent = async () => {
    try {
      const res = await getEvent(id);
      setForm({
        title: res.data.title,
        date: res.data.date.split("T")[0],
        description: res.data.description,
      });
    } catch (err) {
      toast({ title: "Error cargando evento" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, form);
      toast({ title: "Evento actualizado" });
      navigate("/admin/events");
    } catch {
      toast({ title: "Error al actualizar" });
    }
  };

  useEffect(() => {
    loadEvent();
  }, []);

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Editar Evento</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="input"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <textarea
          className="input"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button className="btn bg-green-600 text-white">Guardar cambios</button>
      </form>
    </div>
  );
}
