// =====================================================
// 📁 server.js — Servidor principal de Good Doggy API
// =====================================================

// 🧩 1. Cargar variables de entorno
require("dotenv").config();

// 🚀 2. Dependencias principales
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// ⚙️ 3. Middlewares globales (van antes de las rutas)
// =====================================================
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

// =====================================================
// 🖼️ 4. Carpeta pública de imágenes subidas
// =====================================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================================================
// 🚏 5. Rutas principales del backend
// =====================================================

// 🔑 Autenticación y usuarios
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/users.routes"));

// 👤 Perfil
app.use("/api/profile", require("./src/routes/profile.routes"));

// 🐶 Módulos principales
app.use("/api/dogs", require("./src/routes/dogs.routes"));
app.use("/api/services", require("./src/routes/services.routes"));
app.use("/api/community", require("./src/routes/community.routes"));
app.use("/api/alerts", require("./src/routes/alert.routes"));
app.use("/api/bookings", require("./src/routes/booking.routes"));
app.use("/api/veterinarias", require("./src/routes/veterinarias.routes"));

// ⭐ Mascotas perdidas
app.use("/api/lostpets", require("./src/routes/lostpets.routes"));

// 📅 Eventos
app.use("/api/events", require("./src/routes/events.routes"));

// ⭐⭐⭐ Reseñas de veterinarias (ESTA ES LA NUEVA)
app.use("/api/reviews", require("./src/routes/reviewRoutes.js"));

// 👮 Admin
app.use("/api/admin", require("./src/routes/admin.routes"));

// =====================================================
// 🌐 6. Ruta raíz (para pruebas rápidas)
// =====================================================
app.get("/", (req, res) => {
  res.json({ message: "🐶 Good Doggy API - Backend funcionando correctamente" });
});

// =====================================================
// 🚨 7. Middleware de manejo de errores global
// =====================================================
app.use((err, req, res, next) => {
  console.error("❌ Error global:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// =====================================================
// 🚀 8. Conectar a MongoDB y luego iniciar el servidor
// =====================================================
// ❗ ESTA ES LA PARTE QUE SOLUCIONA TU ERROR
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Good Doggy corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
})();
