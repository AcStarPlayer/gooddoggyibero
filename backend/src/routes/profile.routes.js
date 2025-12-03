const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

// 🔍 Obtener perfil (admin o el mismo usuario)
router.get("/:id", auth, getProfile);

// ✏️ Actualizar perfil con foto opcional
router.put(
  "/:id",
  auth,
  upload.single("foto"),
  updateProfile
);

module.exports = router;
