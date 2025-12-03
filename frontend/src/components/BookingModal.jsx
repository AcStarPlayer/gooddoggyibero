// src/components/BookingModal.jsx
// Modal visual moderno para agendar citas de baño 🐾
import { motion } from "framer-motion";
import { useState } from "react";
import api from "../services/api";

export default function BookingModal({ service, dogs, onClose, onBooked }) {
  const [form, setForm] = useState({ dog: "", date: "", time: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/bookings", {
        dog: form.dog,
        service: service._id,
        date: form.date,
        time: form.time,
      });
      setMsg("✅ Reserva creada correctamente");
      onBooked();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error al crear reserva");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-2xl w-96"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
          Reservar {service.name}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="w-full p-2 border rounded"
            value={form.dog}
            onChange={(e) => setForm({ ...form, dog: e.target.value })}
          >
            <option value="">Selecciona tu perro</option>
            {dogs.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Confirmar Reserva
          </button>

          {msg && <p className="text-sm text-center mt-2">{msg}</p>}
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 text-sm hover:text-gray-800"
        >
          Cancelar
        </button>
      </motion.div>
    </motion.div>
  );
}
