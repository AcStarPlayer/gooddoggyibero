// =====================================================
// 👤 user.model.js — Modelo de Usuario (versión PRO)
// =====================================================

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // 🧾 DATOS PERSONALES
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener mínimo 2 caracteres"],
    },

    lastname: {
      type: String,
      trim: true,
      default: "",
    },

    documentId: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true, // Ya viene hasheada
    },

    // 🏠 UBICACIÓN
    direccion: { type: String, trim: true, default: "" },
    municipio: { type: String, trim: true, default: "" },
    ciudad: { type: String, trim: true, default: "" },

    // 🧠 INTERESES (siempre array limpio)
    intereses: {
      type: [String],
      default: [],
      set: (v) =>
        Array.isArray(v)
          ? v.map((i) => i.trim()).filter((i) => i.length > 0)
          : [],
    },

    // 🐶 RELACIÓN CON MASCOTAS REGISTRADAS
    dogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],

    // 🖼️ FOTO PERFIL
    foto: {
      type: String, // Ej: "/uploads/123.png"
      default:  "/uploads/profile/default.png",

    },

    // 🔐 ROL
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 📅 FECHA DE CREACIÓN
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    versionKey: false, // ❌ No enviar "__v"
    timestamps: false, // Mantienes createdAt manual
  }
);

// =====================================================
// 🚀 Exportar modelo
// =====================================================
module.exports = mongoose.model("User", UserSchema);
