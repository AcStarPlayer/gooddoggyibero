// src/pages/Admin/VeterinariasEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";

export default function VeterinariasEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    servicios: "",
    descripcion: "",
    valor_consulta: "",
    calificacion: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/veterinarias/${id}`);
        const v = res.data;
        setFormData({
          nombre: v.nombre || "",
          direccion: v.direccion || "",
          telefono: v.telefono || "",
          ciudad: v.ciudad || "",
          servicios: Array.isArray(v.servicios) ? v.servicios.join(", ") : (v.servicios || ""),
          descripcion: v.descripcion || "",
          valor_consulta: v.valor_consulta ?? "",
          calificacion: v.calificacion ?? "",
        });
      } catch (err) {
        console.error("Error cargando veterinaria:", err);
        setError("No se pudo cargar la veterinaria");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        servicios: formData.servicios
          ? formData.servicios.split(",").map((s) => s.trim())
          : [],
        valor_consulta: formData.valor_consulta ? Number(formData.valor_consulta) : 0,
        calificacion: formData.calificacion ? Number(formData.calificacion) : 0,
      };

      await api.put(`/veterinarias/${id}`, payload);
      navigate("/admin/veterinarias");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Cargando...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Veterinaria</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 bg-white shadow-md rounded-lg p-6">
        <div>
          <label className="font-semibold">Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="font-semibold">Dirección</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Ciudad</label>
            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="font-semibold">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="font-semibold">Servicios (separados por comas)</label>
          <input type="text" name="servicios" value={formData.servicios} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Valor consulta (COP)</label>
            <input type="number" name="valor_consulta" value={formData.valor_consulta} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="font-semibold">Calificación (estrellas)</label>
            <input type="number" name="calificacion" value={formData.calificacion} onChange={handleChange} className="w-full p-2 border rounded" min="0" max="5" step="0.1" />
          </div>
        </div>

        <div>
          <label className="font-semibold">Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full p-2 border rounded h-28" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <button type="button" onClick={() => navigate("/admin/veterinarias")} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
