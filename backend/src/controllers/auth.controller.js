// =====================================================
// 🔑 auth.controller.js — Controlador de autenticación
// =====================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// =====================================================
// 📌 REGISTRO DE USUARIO
// =====================================================
const register = async (req, res) => {
  
  try {
    const { name, lastname, email, password, address, phone, documentId } = req.body;

    // 🧠 Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
    }

    // 🔎 Verifica si el correo ya existe
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "El correo ya está registrado" });

    // 🔐 Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Crea el usuario
    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      address,
      phone,
      documentId,
      role: "user", // 🔸 Valor por defecto
    });

    console.log(`✅ Usuario registrado: ${user.email}`);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en register:", err.message);
    return res.status(500).json({ message: "Error en el registro", error: err.message });
  }
};

// =====================================================
// 📌 LOGIN DE USUARIO
// =====================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña son requeridos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

    // 🧾 Genera el token JWT
    const payload = { _id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    console.log(`🔑 Usuario autenticado: ${user.email} (${user.role})`);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err.message);
    return res.status(500).json({ message: "Error en el login", error: err.message });
  }
};

module.exports = { register, login };
