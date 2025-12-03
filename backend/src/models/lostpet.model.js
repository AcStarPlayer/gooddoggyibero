// src/models/lostpet.model.js
const mongoose = require("mongoose");

const LostPetSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  tipo: { type: String, enum: ["perro","gato","otro"], default: "perro" },
  color: { type: String },
  zona: { type: String }, // barrio/ciudad
  contacto: { type: String }, // teléfono/email de contacto
  foto: { type: String, default: "" }, // ruta relativa ej. /uploads/lostpets/archivo.jpg
  encontrado: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });

module.exports = mongoose.model("LostPet", LostPetSchema);
