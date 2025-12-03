// =====================================================
// 🐾 dogs.routes.js — Rutas para los perros del usuario
// =====================================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth.middleware");

// Importamos los controladores
const {
  createDog,
  getDogById,
  updateDog,
  deleteDog,
} = require("../controllers/dogs.controller");

const ROOT_DIR = path.join(__dirname, "../../");

// 🌍 BASE_URL profesional
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ========================
// 📸 Multer configuración
// ========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(ROOT_DIR, "uploads/perros/");
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// ====================================
// 📍 RUTAS USANDO CONTROLADORES LIMPIOS
// ====================================

// Crear perro
router.post("/", auth, upload.single("foto"), createDog);

// Obtener perro por ID
router.get("/:id", auth, getDogById);

// Listar perros del usuario autenticado
router.get("/", auth, async (req, res) => {
  try {
    const Dog = require("../models/dog.model");
    const dogs = await Dog.find({ tutor: req.userId }).sort({ createdAt: -1 });
    res.json(dogs);
  } catch (err) {
    console.error("❌ Error listando perros:", err.message);
    res.status(500).json({ message: "Error al listar perros" });
  }
});

// Actualizar perro
router.put("/:id", auth, upload.single("foto"), updateDog);

// Eliminar perro
router.delete("/:id", auth, deleteDog);

module.exports = router;
