// ============================================
// 📁 models/service.model.js
// ============================================

const mongoose = require('mongoose');

// 📌 Esquema para los servicios del spa/paseo/veterinaria
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // 🔸 trim evita espacios innecesarios
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 }, // 🔸 min evita precios negativos
  category: { 
    type: String,
    enum: ['Baño', 'Paseo', 'Veterinaria', 'Guardería', 'Adiestramiento'],
    default: 'Baño'
  },
  imageUrl: { type: String, default: '' }, // 🔸 default vacío evita undefined
  rating: { type: Number, default: 0, min: 0, max: 5 }, // 🔸 control de rango
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
