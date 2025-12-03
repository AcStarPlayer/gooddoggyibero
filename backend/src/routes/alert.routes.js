// ============================================
// 📁 routes/alert.routes.js
// ============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/auth.middleware');

// 📦 Controladores importados
const {
  createAlert,
  getAllAlerts,
  getActiveAlerts,
  resolveAlert
} = require('../controllers/alert.controller');

// =======================================================
// 📸 Configuración de almacenamiento de imágenes con Multer
// =======================================================

// 📂 Directorio destino: /uploads (nivel raíz del proyecto)
const uploadDir = path.join(__dirname, '../../uploads');

// ✅ Si no existe, lo crea (evita errores en despliegue o entornos nuevos)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Carpeta "uploads" creada automáticamente.');
}

// ⚙️ Configuración de Multer para nombrar archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  // 🏷️ Nombre del archivo = timestamp + nombre original
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // extrae extensión (.jpg, .png, etc.)
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// 🧩 Filtro opcional para validar tipos de archivo (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpg, png, gif).'));
  }
};

// 🧱 Inicializa multer con almacenamiento + filtro
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // límite de 5 MB por archivo
});

// =======================================================
// 🧩 Rutas Alertas
// =======================================================

// 📍 Crear alerta (requiere autenticación y puede incluir una imagen)
router.post('/', auth, upload.single('photo'), createAlert);

// 📋 Obtener todas las alertas (acceso público)
router.get('/', getAllAlerts);

// 🐾 Obtener solo las alertas activas
router.get('/activas', getActiveAlerts);

// ✅ Marcar una alerta como resuelta (solo dueño o admin)
router.patch('/:id/resolver', auth, resolveAlert);

// =======================================================
// 📤 Exportación del router
// =======================================================
module.exports = router;
