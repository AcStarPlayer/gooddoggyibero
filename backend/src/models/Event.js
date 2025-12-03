// ============================================================
// 📁 models/Event.js — Modelo de eventos del calendario
// ============================================================

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // 📅 Fecha completa del evento (fecha y hora)
    date: { type: Date, required: true },

    // 🏷️ Tipo de evento (baño, paseo, cita veterinaria, etc.)
    type: { type: String, required: true, trim: true },

    // 🐶 Nombre del perro relacionado al evento
    dogName: { type: String, required: true, trim: true },

    // ⏰ Hora en formato texto (ej: "10:30 AM")
    time: { type: String, required: true },

    // 👤 Propietario del perro (opcional o referencia futura a usuario)
    owner: { type: String, trim: true },
  },
  {
    timestamps: true, // 🕒 agrega createdAt y updatedAt automáticamente
  }
);

// ✅ Exportar modelo listo para usar en controladores
module.exports = mongoose.model("Event", eventSchema);
