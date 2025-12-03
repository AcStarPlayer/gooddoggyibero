import React, { useState } from "react";
import { createEvent } from "@/services/events";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AdminEventsCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form);
      toast({ title: "Evento creado" });
      navigate("/admin/events");
    } catch {
      toast({ title: "Error al crear el evento" });
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Crear Evento</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Título"
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
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button className="btn bg-blue-600 text-white">Crear</button>
      </form>
    </div>
  );
}
