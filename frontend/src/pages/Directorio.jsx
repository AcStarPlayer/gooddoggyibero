{user?.role === "admin" && (
  <button
    onClick={() => navigate("/veterinarias/create")}
    className="bg-teal-700 text-white px-4 py-2 rounded-lg"
  >
    + Agregar veterinaria
  </button>
)}
