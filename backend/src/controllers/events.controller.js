// ============================================================
// 📁 controllers/events.controller.js — lógica del calendario
// ============================================================

const Event = require("../models/Event");

// 📋 Obtener todos los eventos
exports.getEvents = async (req, res) => {
  console.log("📥 Entrando a getEvents()");
  try {
    const events = await Event.find();
    console.log("📊 Eventos obtenidos:", events.length);
    res.json(events);
  } catch (err) {
    console.error("❌ Error en getEvents:", err.message);
    res.status(500).json({ error: "Error obteniendo eventos" });
  }
};

// ✍️ Crear nuevo evento
exports.createEvent = async (req, res) => {
  console.log("📝 Entrando a createEvent()");
  console.log("📦 Datos recibidos:", req.body);
  try {
    const event = new Event(req.body);
    await event.save();
    console.log("✅ Evento guardado con ID:", event._id);
    res.status(201).json(event);
  } catch (err) {
    console.error("❌ Error en createEvent:", err.message);
    res.status(500).json({ error: "Error creando evento" });
  }
};

// 🗑️ Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ error: "Evento no encontrado" });

    res.json({ message: "Evento eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error eliminando evento:", err.message);
    res.status(500).json({ error: "Error eliminando evento" });
  }
};