// ============================================
// 📁 models/booking.model.js
// ============================================

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // ejemplo: "2025-11-10"
  time: { type: String, required: true }, // ejemplo: "10:30 AM"
  status: { type: String, enum: ['pendiente', 'en progreso', 'completado'], default: 'pendiente' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
