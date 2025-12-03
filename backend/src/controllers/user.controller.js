// =====================================================
// 📌 src/controllers/user.controller.js
// =====================================================

const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");

// =====================================================
// 📍 GET /users/:id → Obtener perfil por ID
// =====================================================
exports.getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id)
      .select("-password")
      .populate("dogs", "nombre");

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error getUserProfile:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

// =====================================================
// 📍 PUT /users/:id → Actualizar perfil + foto
// =====================================================
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔐 Solo dueño o admin
    if (req.userId !== userId && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "No autorizado a actualizar este perfil" });
    }

    const { name, lastname, direccion, municipio, ciudad, intereses } =
      req.body;

    const updates = {};

    if (name) updates.name = name;
    if (lastname) updates.lastname = lastname;
    if (direccion) updates.direccion = direccion;
    if (municipio) updates.municipio = municipio;
    if (ciudad) updates.ciudad = ciudad;

    // 🧠 intereses → array siempre limpio
    if (intereses) {
      updates.intereses = String(intereses)
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    // ⚠️⚠️⚠️ CAMBIO IMPORTANTE:
    // Traer al usuario ANTES de usar user.foto
    // (evita ReferenceError y evita redeclaración)
    const user = await User.findById(userId); // <-- MOVIDO AQUÍ
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // 🔥 FOTO NUEVA → eliminar anterior
    if (req.file) {
      console.log("📥 Archivo recibido por Multer:", req.file);

      //user.foto = req.file.filename; // SOLO el nombre     

      const newPath = `/uploads/profile/${req.file.filename}`;
      updates.foto = newPath;

      console.log("📸 Nueva foto guardada en backend:", newPath);

      //const user = await User.findById(userId);

      if (user?.foto) {
        const oldPath = path.join(__dirname, "../..", user.foto);

        console.log("🗑️ Eliminando foto antigua:", oldPath);

        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updateUserProfile:", err);
    res.status(500).json({
      message: "Error al actualizar el perfil",
      error: err.message,
    });
  }
};

// =====================================================
// 📍 PUT /users/change-password/:id
// =====================================================
exports.changePassword = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (req.userId !== targetUserId && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "No autorizado para cambiar esta contraseña" });
    }

    const user = await User.findById(targetUserId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (req.userRole !== "admin") {
      const isMatch = await bcrypt.compare(oldPassword || "", user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "La contraseña actual es incorrecta" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (err) {
    console.error("❌ Error changePassword:", err);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};

// =====================================================
// 📍 GET /users → obtener todos los usuarios (admin)
// =====================================================
exports.getAllUsers = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Solo admin puede ver usuarios" });
    }

    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error("❌ Error getAllUsers:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// =====================================================
// 📍 PUT /users/role → cambiar rol (admin)
// =====================================================
exports.updateUserRole = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Solo admin puede cambiar roles" });
    }

    const { userId, role } = req.body;

    if (!userId || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-password" }
    );

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      message: "Rol actualizado correctamente",
      user,
    });
  } catch (err) {
    console.error("❌ Error updateUserRole:", err);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};
