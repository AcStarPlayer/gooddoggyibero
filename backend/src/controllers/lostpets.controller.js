// src/controllers/lostpets.controller.js
const LostPet = require("../models/lostpet.model");
const path = require("path");

// Listar (público) con opcional filtros ?zona=&tipo=&color=&encontrado=
exports.listLostPets = async (req, res) => {
  try {
    const { zona, tipo, color, encontrado } = req.query;
    const filter = {};
    if (zona) filter.zona = new RegExp(zona, "i");
    if (tipo) filter.tipo = tipo;
    if (color) filter.color = new RegExp(color, "i");
    if (typeof encontrado !== "undefined") filter.encontrado = encontrado === "true";

    const list = await LostPet.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error listar lostpets:", err);
    res.status(500).json({ message: "Error al listar mascotas perdidas" });
  }
};

exports.getLostPet = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await LostPet.findById(id);
    if (!doc) return res.status(404).json({ message: "No encontrada" });
    res.json(doc);
  } catch (err) {
    console.error("Error get lostpet:", err);
    res.status(500).json({ message: "Error al obtener mascota perdida" });
  }
};

// Crear (acepta form-data: foto archivo y campos)
exports.createLostPet = async (req, res) => {
  try {
    const payload = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
      color: req.body.color,
      zona: req.body.zona,
      contacto: req.body.contacto,
      createdBy: req.userId || null,
    };

    if (req.file) {
      // almacena ruta relativa para que frontend la use: /uploads/lostpets/xxx.jpg
      const rel = path.join("/uploads", req.file.destination.split("uploads").pop() || "lostpets", req.file.filename);
      // rel puede quedar como "/lostpets/xxx" si split; mejor construir:
      // build manual: req.file.path contiene ruta absoluta -> convertimos a /uploads/...
      const absolute = req.file.path;
      const tokens = absolute.split(path.sep);
      const idx = tokens.lastIndexOf("uploads");
      if (idx !== -1) {
        const parts = tokens.slice(idx);
        payload.foto = "/" + parts.join("/"); // ejemplo: /uploads/lostpets/xxx.jpg
      } else {
        payload.foto = `/uploads/lostpets/${req.file.filename}`;
      }
    }

    const newDoc = new LostPet(payload);
    await newDoc.save();
    res.json(newDoc);
  } catch (err) {
    console.error("Error crear lostpet:", err);
    res.status(500).json({ message: "Error al crear mascota perdida" });
  }
};

exports.updateLostPet = async (req, res) => {
  try {
    const { id } = req.params;
    const update = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
      color: req.body.color,
      zona: req.body.zona,
      contacto: req.body.contacto,
    };

    if (req.file) {
      const absolute = req.file.path;
      const tokens = absolute.split(path.sep);
      const idx = tokens.lastIndexOf("uploads");
      if (idx !== -1) {
        const parts = tokens.slice(idx);
        update.foto = "/" + parts.join("/");
      } else {
        update.foto = `/uploads/lostpets/${req.file.filename}`;
      }
    }

    const updated = await LostPet.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "No encontrada" });
    res.json(updated);
  } catch (err) {
    console.error("Error update lostpet:", err);
    res.status(500).json({ message: "Error al actualizar mascota perdida" });
  }
};

exports.deleteLostPet = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await LostPet.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "No encontrada" });
    res.json({ message: "Eliminada correctamente" });
  } catch (err) {
    console.error("Error delete lostpet:", err);
    res.status(500).json({ message: "Error al eliminar mascota perdida" });
  }
};

// Marcar como encontrado /toggle
exports.toggleEncontrado = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await LostPet.findById(id);
    if (!doc) return res.status(404).json({ message: "No encontrada" });
    doc.encontrado = !doc.encontrado;
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error("Error toggle encontrado:", err);
    res.status(500).json({ message: "Error actualizando estado" });
  }
};
