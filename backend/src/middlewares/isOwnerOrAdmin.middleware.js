// backend/src/middlewares/isOwnerOrAdmin.middleware.js

// Importamos el modelo para consultar en BD
const LostPet = require("../models/lostpet.model");

module.exports = async function (req, res, next) {
  try {
    // 1. ID de la mascota que se quiere modificar/eliminar
    const petId = req.params.id;

    // 2. Consultamos la mascota en la base de datos
    const pet = await LostPet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    // 3. Verificamos si el usuario autenticado es el dueño
    const isOwner = pet.createdBy?.toString() === req.userId;

    // 4. Verificamos si es admin
    const isAdmin = req.role === "admin";

    // 5. Si es dueño o admin → puede continuar
    if (isOwner || isAdmin) {
      return next();
    }

    // 6. Nadie más puede modificar/eliminar
    return res.status(403).json({ message: "No autorizado" });

  } catch (err) {
    console.error("Error en isOwnerOrAdmin:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
