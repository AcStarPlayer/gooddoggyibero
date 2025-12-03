// ============================================
// 📁 controllers/service.controller.js
// ============================================

const Service = require('../models/service.model');
const fs = require('fs');
const path = require('path');

// =======================================================
// 📌 Crear servicio (solo admin)
// =======================================================
const createService = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // 🧠 Validación básica
    if (!name || !price) {
      return res.status(400).json({ message: 'Nombre y precio son requeridos' });
    }

    // ⚠️ Verificación de rol admin (si tienes isAdmin middleware puedes omitir esto)
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, solo administradores' });
    }

    // 📸 Manejo de imagen subida
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const service = new Service({ name, description, price, category, imageUrl });
    await service.save();

    console.log(`✅ Servicio creado: ${service.name}`);

    res.status(201).json({ message: 'Servicio creado correctamente', service });
  } catch (err) {
    console.error('❌ createService error:', err.message);
    res.status(500).json({ message: 'Error al crear servicio', error: err.message });
  }
};

// =======================================================
// 📋 Obtener todos los servicios (público)
// =======================================================
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error('❌ getAllServices error:', err.message);
    res.status(500).json({ message: 'Error al obtener servicios', error: err.message });
  }
};

// =======================================================
// 🧾 Obtener un servicio por ID
// =======================================================
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    res.json(service);
  } catch (err) {
    console.error('❌ getServiceById error:', err.message);
    res.status(500).json({ message: 'Error al obtener servicio', error: err.message });
  }
};

// =======================================================
// ✏️ Actualizar servicio (solo admin)
// =======================================================
// 🔹 Nueva función añadida SIN romper tu lógica existente
const updateService = async (req, res) => {
  try {
    // Solo admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, solo administradores' });
    }

    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    // Si se sube una nueva imagen, eliminar la anterior del servidor
    if (req.file) {
      if (service.imageUrl) {
        const oldPath = path.join(__dirname, '../../', service.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); // borra el archivo antiguo
      }
      service.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Actualiza solo los campos que se envíen
    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = price;
    if (category) service.category = category;

    await service.save();

    res.json({ message: 'Servicio actualizado correctamente', service });
  } catch (err) {
    console.error('❌ updateService error:', err.message);
    res.status(500).json({ message: 'Error al actualizar servicio', error: err.message });
  }
};

// =======================================================
// 🗑️ Eliminar servicio (solo admin)
// =======================================================
// 🔹 Nueva función añadida SIN romper tu lógica existente
const deleteService = async (req, res) => {
  try {
    // Solo admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, solo administradores' });
    }

    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    // Si tiene imagen asociada, eliminarla del servidor
    if (service.imageUrl) {
      const filePath = path.join(__dirname, '../../', service.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Service.deleteOne({ _id: id });

    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    console.error('❌ deleteService error:', err.message);
    res.status(500).json({ message: 'Error al eliminar servicio', error: err.message });
  }
};

// =======================================================
// 📤 Exportar todos los controladores
// =======================================================
module.exports = { 
  createService, 
  getAllServices, 
  getServiceById,
  updateService,   // 🆕 añadido
  deleteService    // 🆕 añadido
};
