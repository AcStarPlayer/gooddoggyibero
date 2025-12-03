// =====================================================
// 🔑 auth.routes.js — Rutas de autenticación
// =====================================================

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// =====================================================
// 🧩 Rutas de autenticación
// =====================================================

// 📦 Registro de nuevo usuario
// POST /api/auth/register
router.post("/register", register);

// 🔐 Inicio de sesión de usuario
// POST /api/auth/login
router.post("/login", login);

// =====================================================
// 📤 Exportar rutas
// =====================================================
module.exports = router;
