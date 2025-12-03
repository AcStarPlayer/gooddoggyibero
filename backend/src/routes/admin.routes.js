const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllDogs,
  deleteDog,
} = require("../controllers/admin.controller");

// Dashboard básico admin
router.get("/dashboard", (req, res) => {
  res.json({
    users: 0,
    dogs: 0,
    services: 0,
    vets: 0,
    events: 0,
    lostpets: 0,
    alerts: 0,
  });
});

// Usuarios
router.get("/users", getAllUsers);

// Perros (listado)
router.get("/dogs", getAllDogs);

// Perros (eliminar)
router.delete("/dogs/:id", deleteDog);

module.exports = router;
