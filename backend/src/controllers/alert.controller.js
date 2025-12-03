// ============================================
// 📁 controllers/alert.controller.js
// ============================================

const Alert = require('../models/alert.model');
const path = require('path');
const fs = require('fs');

// ============================================================
// 📌 Crear alerta de mascota perdida
// ============================================================
const createAlert = async (req, res) => {
  try {
    const { petName, description, lastSeenLocation, latitude, longitude } = req.body;

    // ✅ Validación mínima obligatoria
    if (!petName || !description) {
      return res.status(400).json({ message: 'El nombre y la descripción son requeridos' });
    }

    // ✅ Conversión segura de coordenadas (si llegan como string desde el form-data)
    const lat = latitude ? parseFloat(latitude) : undefined;
    const lng = longitude ? parseFloat(longitude) : undefined;

    // 📸 Manejo de archivo subido (si existe)
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // 🧠 Creación del documento con datos verificados
    const alert = new Alert({
      petName,
      description,
      lastSeenLocation,
      latitude: lat,
      longitude: lng,
      photoUrl,
      owner: req.userId // obtenido del JWT en el middleware auth
    });

    // 💾 Guardar en la base de datos
    await alert.save();

    res.status(201).json({ message: 'Alerta creada correctamente', alert });
  } catch (err) {
    console.error('❌ createAlert error:', err.message);
    res.status(500).json({ message: 'Error al crear la alerta', error: err.message });
  }
};

// ============================================================
// 📋 Obtener todas las alertas (públicas)
// ============================================================
// 🔹 Ideal para vista de administración o mapa global
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('owner', 'name email') // Muestra nombre y correo del usuario
      .sort({ createdAt: -1 }); // Las más recientes primero

    res.json(alerts);
  } catch (err) {
    console.error('❌ getAllAlerts error:', err.message);
    res.status(500).json({ message: 'Error al obtener alertas', error: err.message });
  }
};

// ============================================================
// 📍 Obtener alertas activas
// ============================================================
// 🔹 Filtra solo las alertas "activa" (sin modificar tu modelo)
const getActiveAlerts = async (req, res) => {
  try {
    const activeAlerts = await Alert.find({ status: 'activa' })
      .sort({ createdAt: -1 })
      .populate('owner', 'name email');

    res.json(activeAlerts);
  } catch (err) {
    console.error('❌ getActiveAlerts error:', err.message);
    res.status(500).json({ message: 'Error al obtener alertas activas', error: err.message });
  }
};

// ============================================================
// ✅ Marcar alerta como resuelta
// ============================================================
// 🔹 Solo el dueño (o admin) puede marcarla como resuelta.
const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    // 🚫 Validación de permisos: solo el dueño o un admin
    if (alert.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para resolver esta alerta' });
    }

    // 🟢 Actualizar estado
    alert.status = 'resuelta';
    await alert.save();

    res.json({ message: 'Alerta marcada como resuelta', alert });
  } catch (err) {
    console.error('❌ resolveAlert error:', err.message);
    res.status(500).json({ message: 'Error al actualizar alerta', error: err.message });
  }
};

// ============================================================
// 📤 Exportación de controladores
// ============================================================
module.exports = { createAlert, getAllAlerts, getActiveAlerts, resolveAlert };
