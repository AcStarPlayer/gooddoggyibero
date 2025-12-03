const mongoose = require("mongoose");

const veterinariaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String }, 
    descripcion: { type: String },
    foto: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔹 Reseñas internas (no usadas por el controller pero no rompen nada)
    reseñas: [
      {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        estrellas: { type: Number, min: 1, max: 5 },
        comentario: String,
        fecha: { type: Date, default: Date.now }
      }
    ],

    calificacionPromedio: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Veterinaria", veterinariaSchema);
