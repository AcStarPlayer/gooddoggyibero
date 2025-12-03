// =====================================================
// 🐶 dog.model.js — Modelo de Perros
// =====================================================
const mongoose = require("mongoose");

const DogSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  raza: { type: String },
  edad: { type: Number },
  foto: { type: String, default: "" },
  descripcion: { type: String },

  // 🔗 Relación con el usuario tutor
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dog", DogSchema);
