const User = require("../models/user.model");
const path = require("node:path");
const fs = require("node:fs");

// 🧹 Elimina foto anterior
const deleteOldPhoto = (photoPath) => {
  if (!photoPath) return;

  const fullPath = path.join(__dirname, "../..", photoPath);

  console.log("🗑️ Eliminando foto:", fullPath);

  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// 📌 Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    console.error("Error getProfile:", err.message); // ▶️ CAMBIO: mostrar error real en consola
    res.status(500).json({ message: "Error cargando perfil" });
  }
};

// 📌 Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔐 Si NO es admin → solo puede editar su propio perfil
    if (req.userRole !== "admin" && req.userId !== userId) {
      return res.status(403).json({
        message: "No tienes permisos para editar este perfil",
      });
    }

    const { nombre, email, telefono, direccion, municipio, ciudad } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // 🖼 Si subió nueva foto, eliminar foto anterior 
    // ⚠️ CAMBIO: Evitar borrar una foto por defecto
    if (req.file) {
      console.log("📥 Archivo recibido por Multer:", req.file);

      if (user.foto && !user.foto.includes("default.png")) {
        deleteOldPhoto(user.foto); // ▶️ CAMBIO agregado: evita borrar default.png
      }

      user.foto = `/uploads/profile/${req.file.filename}`; 
      console.log("📸 Nueva foto guardada:", user.foto);
    }

    // ✉️ CAMBIO: Validar si se intenta cambiar el email
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({
          message: "El email ya está registrado por otro usuario",
        });
      }
    }

    // ✔️ Actualización de campos usando nullish operator
    user.nombre = nombre ?? user.nombre;
    user.email = email ?? user.email;
    user.telefono = telefono ?? user.telefono;
    user.direccion = direccion ?? user.direccion;
    user.municipio = municipio ?? user.municipio;
    user.ciudad = ciudad ?? user.ciudad;

    // 💾 Guardar cambios
    await user.save();

    res.json({
      message: "Perfil actualizado correctamente",
      user: {
        ...user.toObject(),
        foto: `/uploads/profile/${req.file.filename}`
      }
    });

  } catch (err) {
    console.error("Error updateProfile:", err.message); // ▶️ CAMBIO: mostrar msg exacto
    res.status(500).json({
      message: "Error actualizando perfil",
      error: err.message, // ▶️ CAMBIO: enviar detalle para debug
    });
  }
};
