// src/pages/Unauthorized.jsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Acceso denegado 🚫
      </h1>
      <p className="text-gray-700 mb-6">
        No tienes permisos para ver esta página.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}
