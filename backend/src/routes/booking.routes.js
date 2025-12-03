// ============================================
// 📁 routes/booking.routes.js
// ============================================

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/booking.controller');

// 🧍 Crear reserva (usuario autenticado)
router.post('/', auth, createBooking);

// 📋 Obtener reservas del usuario actual
router.get('/mine', auth, getMyBookings);

// 🧾 Obtener todas las reservas (solo admin)
router.get('/', auth, isAdmin, getAllBookings);

// 🔁 Actualizar estado (solo admin)
router.patch('/:id/status', auth, isAdmin, updateBookingStatus);

module.exports = router;
