// =====================================================
// 🏥 veterinarias.controller.js
// =====================================================
const Veterinaria = require("../models/veterinaria.model");
const Review = require("../models/review.model");

// =====================================================
// 🟢 Obtener todas las veterinarias
// =====================================================
exports.getVeterinarias = async (req, res) => {
  try {
    const lista = await Veterinaria.find().sort({ createdAt: -1 });
    res.json(lista);
  } catch (error) {
    console.error("Error al obtener veterinarias:", error);
    res.status(500).json({ message: "Error al obtener veterinarias" });
  }
};

// =====================================================
// 🟢 Obtener reseñas de una veterinaria
// =====================================================
exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reseñas = await Review.find({ veterinaria: id })
      .populate("usuario", "nombre email")
      .sort({ createdAt: -1 });

    // Transformar datos para el frontend
    const formateadas = reseñas.map(r => ({
      _id: r._id,
      comentario: r.comentario,
      calificacion: r.calificacion,
      usuarioNombre: r.usuario?.nombre || "Usuario",
      fecha: r.createdAt
    }));

    res.json(formateadas);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// =====================================================
// 🔵 Crear veterinaria (solo admin)
// =====================================================
exports.createVeterinaria = async (req, res) => {
  try {
    const { nombre, direccion, telefono, descripcion, foto } = req.body;

    // Validar campos requeridos
    if (!nombre || !direccion) {
      return res.status(400).json({ message: "Nombre y dirección son obligatorios" });
    }

    const nuevaVet = new Veterinaria({
      nombre,
      direccion,
      telefono,
      descripcion,
      foto: foto || "",
      createdBy: req.userId
    });

    await nuevaVet.save();

    res.json(nuevaVet);
  } catch (error) {
    console.error("Error al crear veterinaria:", error);
    res.status(500).json({ message: "Error al crear veterinaria" });
  }
};

