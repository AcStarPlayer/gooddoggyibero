// ============================================
// 📁 routes/services.routes.js
// ============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware'); 
const { 
  createService, 
  getAllServices, 
  getServiceById,
  updateService,     // 🆕 añadido
  deleteService      // 🆕 añadido
} = require('../controllers/service.controller');

// =======================================================
// 🗂️ Configuración de uploads
// =======================================================
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(/\s+/g, '-') // elimina espacios
      .replace(/[^a-zA-Z0-9\-\.]/g, '') // deja solo caracteres seguros
      .slice(0, 40); // corta nombres muy largos
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});
const upload = multer({ storage });

// =======================================================
// 🧩 Rutas CRUD de servicios
// =======================================================

// 📍 Crear servicio (solo admin)
router.post('/', auth, isAdmin, upload.single('image'), createService);

// 📍 Listar todos los servicios (público)
router.get('/', getAllServices);

// 📍 Obtener un servicio por ID
router.get('/:id', getServiceById);

// 📍 Actualizar servicio (solo admin)
// 🔸 Se puede actualizar texto e imagen (si se manda nueva)
router.put('/:id', auth, isAdmin, upload.single('image'), updateService);

// 📍 Eliminar servicio (solo admin)
router.delete('/:id', auth, isAdmin, deleteService);

// =======================================================
// ✅ Exportar router
// =======================================================
module.exports = router;

