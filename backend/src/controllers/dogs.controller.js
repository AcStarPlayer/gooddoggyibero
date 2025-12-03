// =====================================================
// 🐶 dogs.controller.js — Controladores profesionales
// =====================================================
const Dog = require("../models/dog.model");
const User = require("../models/user.model");

// -----------------------------------------------------
// 📍 Crear perro
// -----------------------------------------------------
const createDog = async (req, res) => {
  try {
    const { nombre, raza, edad, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre del perro es obligatorio" });
    }

    const fotoUrl = req.file
      ? `/uploads/perros/${req.file.filename}`   // ← SOLO ruta relativa
      : "";

    const dog = new Dog({
      nombre,
      raza,
      edad,
      descripcion,
      tutor: req.userId,
      foto: fotoUrl,
    });

    await dog.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { dogs: dog._id },
    });

    res.status(201).json({
      message: "Perro registrado correctamente",
      dog,
    });
  } catch (error) {
    console.error("❌ Error creando perro:", error);
    res.status(500).json({ message: "Error al registrar el perro" });
  }
};

// -----------------------------------------------------
// 📍 Obtener perro por ID
// -----------------------------------------------------
const getDogById = async (req, res) => {
  try {
    const dog = await Dog.findOne({
      _id: req.params.id,
      tutor: req.userId,
    });

    if (!dog) {
      return res.status(404).json({ message: "Perro no encontrado" });
    }

    res.json(dog);

  } catch (error) {
    console.error("❌ Error obteniendo perro:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// -----------------------------------------------------
// 📍 Editar perro
// -----------------------------------------------------
const updateDog = async (req, res) => {
  try {
    const dogId = req.params.id;

    const dog = await Dog.findOne({ _id: dogId, tutor: req.userId });
    if (!dog) {
      return res.status(404).json({ message: "Perro no encontrado o no autorizado" });
    }

    const updateData = {
      nombre: req.body.nombre,
      raza: req.body.raza,
      edad: req.body.edad,
      descripcion: req.body.descripcion,
    };

    if (req.file) {
      updateData.foto = `/uploads/perros/${req.file.filename}`;  // ← IGUAL, solo ruta
    }

    const updatedDog = await Dog.findByIdAndUpdate(
      dogId,
      updateData,
      { new: true }
    );

    res.json({
      message: "Perro actualizado correctamente",
      dog: updatedDog,
    });

  } catch (error) {
    console.error("❌ Error actualizando perro:", error);
    res.status(500).json({ message: "Error al actualizar perro" });
  }
};

// -----------------------------------------------------
// 📍 Eliminar perro
// -----------------------------------------------------
const deleteDog = async (req, res) => {
  try {
    const dogId = req.params.id;

    const dog = await Dog.findOne({ _id: dogId, tutor: req.userId });
    if (!dog) {
      return res.status(404).json({ message: "Perro no encontrado o no autorizado" });
    }

    await Dog.findByIdAndDelete(dogId);

    await User.findByIdAndUpdate(req.userId, {
      $pull: { dogs: dogId }
    });

    res.json({ message: "Perro eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error eliminando perro:", error);
    res.status(500).json({ message: "Error al eliminar el perro" });
  }
};

module.exports = {
  createDog,
  getDogById,
  updateDog,
  deleteDog,
};
