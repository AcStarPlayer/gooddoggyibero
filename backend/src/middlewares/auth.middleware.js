// ============================================
// 🔒 auth.middleware.js
// --------------------------------------------
// Middleware para verificar tokens JWT y
// asignar los datos del usuario al request.
// Este middleware debe ejecutarse ANTES de isAdmin.
// ============================================

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // 🧩 Obtiene el encabezado Authorization
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // 🚫 Si no hay encabezado o formato incorrecto
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token no provisto o formato incorrecto",
      });
    }

    // 🔍 Extrae el token
    const token = authHeader.split(" ")[1];

    // ✅ Verifica el token JWT y obtiene los datos del usuario
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Asigna info útil al request (queda disponible para otros middlewares)
    req.userId = payload._id;
    req.userRole = payload.role; // <- isAdmin.middleware depende de esto

    // 🚀 Pasa al siguiente middleware o controlador
    next();
  } catch (err) {
    console.error("❌ Error en auth.middleware:", err.message);

    // ⚠️ Manejo detallado de errores JWT
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado, por favor inicia sesión de nuevo",
      });
    }

    return res.status(401).json({
      message: "Token inválido o no autorizado",
    });
  }
};

module.exports = auth;
