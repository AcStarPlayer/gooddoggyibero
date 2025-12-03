// ============================================
// 🛡️ isAdmin.middleware.js
// --------------------------------------------
// Middleware para restringir acceso a rutas
// que solo pueden usar los administradores.
// Requiere que auth.middleware.js asigne:
//   - req.userRole → rol del usuario actual
// ============================================

module.exports = (req, res, next) => {
  try {
    // ⚙️ Verifica que el rol del usuario exista
    // (esto implica que el token ya fue validado por auth.middleware.js)
    if (!req.userRole) {
      return res.status(401).json({
        message: "Usuario no autenticado o rol no definido",
      });
    }

    // 🚫 Bloquea si el usuario no es administrador
    if (req.userRole !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado: solo administradores pueden realizar esta acción",
      });
    }

    // ✅ Si pasa todas las validaciones, permite continuar
    next();
  } catch (err) {
    console.error("❌ Error en isAdmin.middleware:", err.message);

    // 🧩 Respuesta controlada ante errores inesperados
    return res.status(500).json({
      message: "Error interno en el middleware de administrador",
      error: err.message,
    });
  }
};
