// ============================================
// 📁 controllers/booking.controller.js
// ============================================

const Booking = require('../models/booking.model');

// 📅 Crear reserva
const createBooking = async (req, res) => {
  try {
    const { dog, service, date, time } = req.body;
    if (!dog || !service || !date || !time) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const booking = new Booking({
      user: req.userId,
      dog,
      service,
      date,
      time,
    });

    await booking.save();
    res.status(201).json({ message: 'Reserva creada correctamente', booking });
  } catch (err) {
    console.error('❌ createBooking error:', err.message);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

// 📋 Obtener reservas del usuario actual
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('dog service')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ getMyBookings error:', err.message);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

// 🧾 Obtener todas las reservas (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user dog service')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ getAllBookings error:', err.message);
    res.status(500).json({ message: 'Error al obtener todas las reservas' });
  }
};

// 🔁 Actualizar estado de una reserva (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['pendiente', 'en progreso', 'completado'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'Estado actualizado', booking });
  } catch (err) {
    console.error('❌ updateBookingStatus error:', err.message);
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
