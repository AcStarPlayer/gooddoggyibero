// =====================================================
// 📦 src/config/db.js — Conexión a MongoDB con Mongoose
// =====================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  // 🧩 1️⃣ Validar URI
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: La variable MONGODB_URI no está definida en el archivo .env');
    process.exit(1);
  }

  try {
    // 🚀 2️⃣ Intentar conexión
    await mongoose.connect(uri, {
      // 🔹 Estas opciones ya son automáticas en Mongoose 8.x
      // pero se dejan para compatibilidad con versiones 7.x
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // ⏳ Tiempo máximo de conexión
    });

    // 🟢 3️⃣ Confirmación visual
    const db = mongoose.connection;
    console.log(`✅ MongoDB conectado correctamente a: ${db.host}:${db.port}`);

    // 🧠 4️⃣ Manejar desconexiones automáticas
    db.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado. Intentando reconexión...');
    });

    db.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
