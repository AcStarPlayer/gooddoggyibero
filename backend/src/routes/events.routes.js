// ============================================================
// 📁 routes/events.routes.js — rutas reales para eventos (calendario)
// ============================================================

console.log("🧭 events.routes.js cargado correctamente"); // 👈 Nuevo log

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware"); // ✅ proteger creación
//const { getEvents, createEvent } = require("../controllers/events.controller");
const { getEvents, createEvent, deleteEvent } = require("../controllers/events.controller");

// ============================================================
// 🧭 Endpoints del calendario (FullCalendar)
// ============================================================

// 📋 Obtener todos los eventos (público)
{/* router.get("/", (req, res, next) => {
  console.log("📅 GET /api/events llamado");
  next();
}, getEvents); */}

router.get("/", (req, res) => {
  console.log("📅 GET /api/events llamado");
  getEvents(req, res);
});

// ✍️ Crear nuevo evento (requiere login)
router.post("/", auth, (req, res, next) => {
  console.log("✍️ POST /api/events llamado — body:", req.body);
  next();
}, createEvent);

// 🗑️ Eliminar evento
router.delete("/:id", auth, deleteEvent);

// ============================================================
// 📤 Exportar router
// ============================================================
console.log("✅ events.routes.js exportado correctamente"); // 👈 Nuevo log
module.exports = router;
