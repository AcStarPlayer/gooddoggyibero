const User = require("../models/user.model");

const Dog = require("../models/dog.model");

// =============================================
// ✔ TRAER TODOS LOS USUARIOS
// =============================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// =============================================
// 🐶✔ TRAER TODOS LOS PERROS (ADAPTADO AL FRONTEND)
// =============================================
const getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.find().populate("tutor", "name email");

    const formattedDogs = dogs.map((d) => ({
      _id: d._id,
      name: d.nombre,
      breed: d.raza,
      age: d.edad,
      owner: d.tutor,
    }));

    res.json(formattedDogs);
  } catch (error) {
    console.error("Error al obtener perros:", error);
    res.status(500).json({ message: "Error al obtener perros" });
  }
};

// =============================================
// 🗑✔ ELIMINAR PERRO
// =============================================
const deleteDog = async (req, res) => {
  try {
    await Dog.findByIdAndDelete(req.params.id);
    res.json({ message: "Perro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar perro:", error);
    res.status(500).json({ message: "Error al eliminar perro" });
  }
};

module.exports = {
  getAllUsers,
  getAllDogs,
  deleteDog,
};
