import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🆕 Para redirigir al post individual
import api from "../services/api";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🆕 Hook para navegación

  // 🔐 Usuario autenticado (para validar permisos)
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/community");
      setPosts(res.data);
    } catch (err) {
      console.error("Error al obtener publicaciones", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", content);
      if (image) formData.append("image", image);

      await api.post("/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setImage(null);
      fetchPosts(); // recarga las publicaciones
    } catch (err) {
      console.error("Error al publicar:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      await api.post(`/community/${postId}/comments`, { text });
      fetchPosts();
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  // 🗑️ Eliminar publicación (solo autor o admin)
  const deletePost = async (postId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;

    try {
      await api.delete(`/community/${postId}`);
      fetchPosts(); // refrescar lista
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
    }
  };

  // 🆕 Nueva función para abrir una publicación individual
  const handleOpenPost = (postId) => {
    navigate(`/community/${postId}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🐾 Comunidad Canina</h2>

      {/* Formulario de publicación */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-4 mb-6 border"
      >
        <textarea
          className="w-full border rounded-lg p-2 mb-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder="Comparte algo sobre tu peludo..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-3"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>

      {/* 🆕 Bloque actualizado (el que me pediste integrar) */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => (
          
          <div
            key={post._id}
            //className="bg-white shadow rounded-xl p-4 mb-4 border hover:shadow-lg transition cursor-pointer"
            className="bg-white border rounded-2xl shadow-sm mb-6 overflow-hidden hover:shadow-md transition"
          >
          
            {/* 🔥 HEADER estilo Instagram */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={
                    post.author?.foto
                      ? `http://localhost:5000${post.author.foto}`
                      : post.author?.photo
                      ? `http://localhost:5000${post.author.photo}`
                      : "/default_profile.jpg"
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {post.author?.name || "Usuario"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>    


            {/* ❌ Eliminar (Solo admin o autor) */}
              {(post.author?._id === userId || role === "admin") && (
                <button
                  onClick={() => deletePost(post._id)}
                  //className="text-red-500 text-xs float-right hover:text-red-700"
                  className="ml-auto text-red-500 text-sm hover:text-red-700"
                >
                  Eliminar
                </button>
              )}
            </div>

            {/* 🔥 Imagen grande estilo Instagram */}
            {post.imageUrl && (
              <img
                src={`http://localhost:5000${post.imageUrl}`}
                alt="publicación"
                className="w-full max-h-[550px] object-cover bg-gray-200 cursor-pointer"
                onClick={() => handleOpenPost(post._id)}
              />
            )}

            {/* 🔥 Texto + acciones */}
            <div className="p-4">

              {/* Like + comentarios (puedes mejorar después) */}
              <div className="flex items-center gap-6 text-gray-700 text-xl mb-3">
                {/*<span className="cursor-pointer">❤️</span>*/}
                <span className="cursor-pointer"></span>
                {/*<span className="cursor-pointer">💬</span>*/}
                <span className="cursor-pointer"></span>
              </div>

              {/* Texto del post */}
              <p
                className="text-gray-800 cursor-pointer"
                onClick={() => handleOpenPost(post._id)}
              >
                <span className="font-semibold mr-1">
                  {post.author?.name}:
                </span>
                {post.text}
              </p>

              {/* Contador de comentarios */}
              <p
                className="text-gray-500 text-sm mt-2 cursor-pointer"
                onClick={() => handleOpenPost(post._id)}
              >
                Ver {post.comments?.length || 0} comentarios
              </p>

            </div>

            {/* 🔹 Nuevo enlace al detalle del post */}
            {/*<a
              href={`/community/${post._id}`}
              onClick={(e) => {
                e.preventDefault();
                handleOpenPost(post._id);
              }}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {post.text}
            </a>

            {post.imageUrl && (
              <img
                src={`http://localhost:5000${post.imageUrl}`}
                alt="post"
                className="rounded-lg w-full max-h-60 object-cover mb-3 mt-2"
              />
            )}

            <p className="text-gray-600 text-sm mb-2">
              💬 {post.comments?.length || 0} respuestas
            </p>*/}
          </div>
        ))
      )}
    </div>
  );
};

// 🔹 Subcomponente para comentar (sin cambios)
const CommentBox = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    addComment(postId, text);
    setText("");
  };

  return (
    <div className="flex mt-2">
      <input
        className="flex-1 border rounded-lg px-2 py-1 text-sm"
        placeholder="Escribe un comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="ml-2 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
      >
        Enviar
      </button>
    </div>
  );
};

export default Community;
