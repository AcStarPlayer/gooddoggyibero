// src/middlewares/upload.middleware.js
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

const ROOT_DIR = path.join(__dirname, "../../");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");

// Crea /uploads si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Decide carpeta objetivo según la ruta (preserva profile y perros)
function resolveFolder(req) {
  const base = req.baseUrl || "";
  if (base.includes("lostpets")) return "lostpets";
  if (base.includes("profile")) return "profile";
  if (base.includes("users")) return "profile";   // NUEVO → arregla tu problema
  if (base.includes("perros") || base.includes("dogs")) return "perros";
  // fallback
  return "others";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folder = resolveFolder(req);
      const target = path.join(UPLOADS_DIR, folder);
      if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
      cb(null, target);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Mantener nombres razonables: profile_xxx para profile, lostpet_xxx para lostpets
    if ((req.baseUrl || "").includes("profile")) {
      cb(null, `profile_${Date.now()}${ext}`);
    } else if ((req.baseUrl || "").includes("lostpets")) {
      cb(null, `lostpet_${Date.now()}${ext}`);
    } else {
      cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Formato inválido. Solo JPG/JPEG/PNG/WEBP"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
