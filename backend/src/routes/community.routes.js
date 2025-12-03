// ============================================================
// 📁 routes/community.routes.js
// ============================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/auth.middleware');

// 📦 Importamos los controladores del módulo Community
const {
  createPost,
  getAllPosts,
  addComment,
  likePost,
  getPostById, // 🆕 🔥 AGREGADO: necesario para la ruta de detalle
  deletePost, 
} = require('../controllers/community.controller');

// ============================================================
// 📸 Configuración de almacenamiento para imágenes (Multer)
// ============================================================

// 📂 Directorio donde se guardarán las imágenes subidas
const uploadDir = path.join(__dirname, '../../uploads');

// ✅ Crear la carpeta si no existe (previene errores al subir)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Carpeta "uploads" creada automáticamente para publicaciones.');
}

// ⚙️ Configuración de cómo se almacenarán los archivos
const storage = multer.diskStorage({
  // Ruta destino (la carpeta uploads)
  destination: (req, file, cb) => cb(null, uploadDir),

  // 🏷️ Nombre del archivo = timestamp + nombre original
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ej: ".jpg"
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// 🧩 Validación opcional: solo imágenes permitidas (jpg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, gif).'));
  }
};

// 🚀 Inicializamos Multer con validaciones y límites
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite: 5 MB
});

// ============================================================
// 🧭 Endpoints Community
// ============================================================

// 📝 Crear una nueva publicación (requiere token + imagen opcional)
router.post('/', auth, upload.single('image'), createPost);

// 📋 Obtener todas las publicaciones (público)
router.get('/', getAllPosts);

// 🆕 📄 Obtener una publicación específica (público o con token opcional)
router.get('/:id', getPostById); // ✅ ya no da error porque está importado

// 💬 Agregar comentario a una publicación (requiere token)
router.post('/:id/comments', auth, addComment);

// ❤️ Dar like a una publicación (requiere token)
router.post('/:id/like', auth, likePost);

// 🗑️ Eliminar publicación (solo autor o admin)
router.delete("/:id", auth, deletePost);

// ============================================================
// 📤 Exportamos el router para usarlo en server.js
// ============================================================
module.exports = router;
