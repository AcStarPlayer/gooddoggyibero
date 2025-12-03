// =====================================================
// 🛣️ user.routes.js
// =====================================================

const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  updateUserRole,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
  changePassword,
} = require("../controllers/user.controller");

{/*// 📸 Multer config  //lo comente para revisarlo
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });*/}
// =====================================================
// 📌 Rutas estáticas (deben ir primero)
// =====================================================
router.get("/", authMiddleware, getAllUsers);
router.put("/role", authMiddleware, updateUserRole);
router.put("/change-password/:id", authMiddleware, changePassword);

// =====================================================
// 📌 Rutas dinámicas (requieren :id)
// =====================================================
router.get("/:id", authMiddleware, getUserProfile);
router.put("/:id", authMiddleware, upload.single("foto"), updateUserProfile);


module.exports = router;
