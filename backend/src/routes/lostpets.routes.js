// src/routes/lostpets.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

// middlewares auth/isAdmin si quieres proteger (opcional)
const auth = require("../middlewares/auth.middleware"); // si lo tienes
const isAdmin = require("../middlewares/isAdmin.middleware"); // si lo tienes

// NUEVO → IMPORTAR
const isOwnerOrAdmin = require("../middlewares/isOwnerOrAdmin.middleware");

const {
  listLostPets,
  getLostPet,
  createLostPet,
  updateLostPet,
  deleteLostPet,
  toggleEncontrado
} = require("../controllers/lostpets.controller");
//} = require("./controllers/lostpets.controller");

// Público
router.get("/", listLostPets);
router.get("/:id", getLostPet);

// Admin/Privado: crear - si quieres que cualquier usuario registrado cree, usa auth en vez de isAdmin
router.post("/", auth, upload.single("foto"), createLostPet);

// Actualizar (admin o creador) — aquí uso auth y asumo autorización extra en controlador si quieres
router.put("/:id", auth, upload.single("foto"), updateLostPet);

// Eliminar (admin)
router.delete("/:id", auth, isAdmin, deleteLostPet);

// Toggle encontrado (admin o auth) — se puede cambiar según reglas
router.post("/:id/toggle-encontrado", auth, toggleEncontrado);

module.exports = router;
