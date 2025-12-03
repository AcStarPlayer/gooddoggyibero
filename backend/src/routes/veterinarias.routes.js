const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const {
  getVeterinarias,
  getReviews,
  createVeterinaria
} = require("../controllers/veterinarias.controller");

// Público
router.get("/", getVeterinarias);
router.get("/:id/reviews", getReviews);

// Admin
router.post("/", auth, isAdmin, createVeterinaria);

module.exports = router;
