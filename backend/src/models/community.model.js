// ============================================================
// 📁 models/community.model.js — Modelo de publicaciones
// ============================================================

const mongoose = require('mongoose');

// ============================================================
// 💬 Subdocumento de comentarios
// ============================================================
const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ============================================================
// 🧱 Modelo principal de publicaciones
// ============================================================
const CommunitySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // usuario creador
  text: { type: String, required: true, trim: true }, // contenido del post
  imageUrl: { type: String }, // ruta de imagen (opcional)

  likes: { type: Number, default: 0 }, // contador de likes

  // ❤️ NUEVO: lista de usuarios que dieron like (para evitar duplicados)
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  comments: [CommentSchema], // comentarios embebidos

  createdAt: { type: Date, default: Date.now },
});

// ============================================================
// 📤 Exportación del modelo
// ============================================================
module.exports = mongoose.model('Community', CommunitySchema);
