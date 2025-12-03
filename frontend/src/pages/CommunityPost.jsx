// src/pages/CommunityPost.jsx
// ✅ Vista detalle de una publicación + respuestas (mini-foro)
// No rompe la lógica existente: usa el mismo endpoint que ya usas en Community.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function CommunityPost() {
  const { id } = useParams(); // 🆕 ID de la publicación tomada desde la URL
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠️ Carga la publicación cada vez que cambia el id (cuando se navega)
  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 🔁 Obtiene el post por id desde el backend: GET /api/community/:id
  // (debes tener ese endpoint implementado en el backend, como ya usas en Community.jsx)
  const fetchPost = async () => {
    try {
      const res = await api.get(`/community/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error al obtener publicación:", err);
    }
  };

  // 📨 Enviar un comentario: POST /api/community/:id/comments
  // Reutiliza tu endpoint de comentarios (idéntico al de Community.jsx)
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await api.post(`/community/${id}/comments`, { text: comment });
      setComment("");
      await fetchPost(); // recarga los comentarios tras publicar
    } catch (err) {
      console.error("Error al comentar:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟡 Mientras carga muestra un mensaje simple (igual patrón que usas en otros componentes)
  if (!post)
    return <p className="text-center text-gray-500 mt-10">Cargando publicación...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      {/* 🔙 Enlace para volver a la lista (mantiene navegación SPA con React Router) */}
      <Link
        to="/community"
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Volver a la comunidad
      </Link>

      <div className="bg-white p-6 shadow-md rounded-xl border">
        {/* 📝 Contenido principal de la publicación */}
        <h2 className="text-xl font-bold mb-2 text-gray-800">{post.content}</h2>

        {/* 🖼 Si la publicación tiene imagen, la mostramos usando la misma ruta que usas en Community */}
        {post.imageUrl && (
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt="post"
            className="rounded-lg w-full max-h-80 object-cover mb-3"
          />
        )}

        {/* ✉️ Sección de respuestas */}
        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
          Respuestas 💬
        </h3>

        {/* ✅ Contenedor scrollable para comentarios */}
        <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
          {post.comments?.length > 0 ? (
            post.comments.map((c, i) => (
              <p key={i} className="text-gray-700 mb-1 border-b pb-1">
                🗨️ {c.text}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No hay respuestas aún.</p>
          )}
        </div>

        {/* 🧾 Form para enviar nueva respuesta */}
        <form onSubmit={handleComment} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu respuesta..."
            className="flex-1 border rounded-lg px-3 py-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Enviando..." : "Responder"}
          </button>
        </form>
      </div>
    </div>
  );
}
