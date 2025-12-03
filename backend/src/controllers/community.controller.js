// ============================================================
// 📁 controllers/community.controller.js
// ============================================================

const Community = require("../models/community.model");
const path = require("path");
const fs = require("fs");

// ============================================================
// 🧩 Crear publicación
// ============================================================
const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // 🔍 Validación básica
    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "El texto de la publicación es obligatorio" });
    }

    // 📸 Si se subió imagen, guardamos su ruta
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 🧱 Crear objeto del post
    const post = new Community({
      author: req.userId,
      text: text.trim(),
      imageUrl,
    });

    // 💾 Guardar en MongoDB
    await post.save();

    // 📤 Responder al cliente
    res.status(201).json({
      message: "✅ Publicación creada exitosamente",
      post,
    });
  } catch (err) {
    console.error("❌ Error en createPost:", err.message);
    res
      .status(500)
      .json({ message: "Error al crear publicación", error: err.message });
  }
};

// ============================================================
// 📋 Obtener todas las publicaciones (ordenadas por fecha)
// ============================================================
const getAllPosts = async (req, res) => {
  try {
    const posts = await Community.find()
      .populate("author", "name email") // 🔗 Muestra datos básicos del autor
      .populate("comments.author", "name email") // 🔗 También muestra los autores de los comentarios
      .sort({ createdAt: -1 }); // 📅 Más recientes primero

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error en getAllPosts:", err.message);
    res
      .status(500)
      .json({ message: "Error al obtener publicaciones", error: err.message });
  }
};

// ============================================================
// 🆕 📄 Obtener una publicación por ID (para CommunityPost.jsx)
// ============================================================
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Community.findById(id)
      .populate("author", "name email")
      .populate("comments.author", "name email");

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Error en getPostById:", err.message);
    res
      .status(500)
      .json({ message: "Error al obtener publicación", error: err.message });
  }
};

// ============================================================
// 💬 Agregar comentario a una publicación
// ============================================================
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "El comentario no puede estar vacío" });
    }

    // 📦 Buscar publicación
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // ➕ Agregar comentario al array
    post.comments.push({
      author: req.userId,
      text: text.trim(),
      createdAt: new Date(),
    });

    await post.save();

    // 🔁 Volver a poblar autor para respuesta completa
    const updated = await post.populate("comments.author", "name email");

    res.status(201).json({
      message: "💬 Comentario agregado correctamente",
      post: updated,
    });
  } catch (err) {
    console.error("❌ Error en addComment:", err.message);
    res
      .status(500)
      .json({ message: "Error al agregar comentario", error: err.message });
  }
};

// ============================================================
// ❤️ Dar like (evitar duplicados)
// ============================================================
const likePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // ⚠️ Prevenir que un usuario dé like varias veces
    if (!post.likedBy) post.likedBy = [];
    if (post.likedBy.includes(req.userId)) {
      return res
        .status(400)
        .json({ message: "Ya diste like a esta publicación" });
    }

    // ❤️ Agregar like
    post.likes += 1;
    post.likedBy.push(req.userId);
    await post.save();

    res.status(200).json({
      message: "👍 Like agregado correctamente",
      likes: post.likes,
    });
  } catch (err) {
    console.error("❌ Error en likePost:", err.message);
    res
      .status(500)
      .json({ message: "Error al dar like", error: err.message });
  }
};

// ============================================================
// 🗑️ Eliminar publicación (solo autor o admin)
// ============================================================
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Community.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // 🚫 Validar permisos
    // Autor del post → post.author
    // Usuario autenticado → req.userId
    // Rol del usuario → req.role (de auth.middleware)
    const isOwner = post.author.toString() === req.userId;
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar esta publicación",
      });
    }

    // 🗑️ Si tiene imagen, eliminar archivo del servidor
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, "../../", post.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // 🧽 Eliminar publicación
    await post.deleteOne();

    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (err) {
    console.error("❌ Error en deletePost:", err.message);
    res.status(500).json({
      message: "Error al eliminar publicación",
      error: err.message,
    });
  }
};

// ============================================================
// 📤 Exportar controladores
// ============================================================
module.exports = {
  createPost,
  getAllPosts,
  getPostById, // 🆕 Asegúrate de exportarlo
  addComment,
  likePost,
  deletePost,
};
