import React, { useEffect, useState } from "react";
// Se eliminan importaciones relativas y se reemplazan por Mocks internos
// import { useParams, useNavigate } from "react-router-dom";
// import { getDogById, updateDog } from "@/services/dogs";
// import { useAuth } from "@/context/AuthContext";

// Se usan elementos nativos o clases de Tailwind en lugar de componentes de librería externa
// import { motion } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";


// =====================================================
// MOCK 1: useAuth (Simulación de Autenticación)
// =====================================================
const MOCK_TOKEN = "MOCK-AUTH-TOKEN-7890";
const useAuth = () => ({
  token: MOCK_TOKEN,
});

// =====================================================
// MOCK 2: useParams & useNavigate (Simulación de Router)
// Usamos un ID de mascota fijo para la demostración
// =====================================================
const MOCK_ID = "dog-456"; 
const useParams = () => ({ id: MOCK_ID });
const useNavigate = () => (path) => {
  console.log(`[MOCK Navegación] Se intentó navegar a: ${path}`);
  alert(`[Navegación Simulada] Guardado exitoso. Redirigiendo a: ${path}`);
};

// =====================================================
// MOCK 3: Datos de Mascota de Simulación
// Esta variable simulará nuestra "base de datos"
// =====================================================
let MOCK_DOG_DATA = {
    "dog-456": {
        id: "dog-456",
        nombre: "Rocky",
        raza: "Pastor Alemán",
        edad: "3", // Debe ser string para simular la entrada de formulario
        descripcion: "Rocky es un perro guardián muy leal, adora las pelotas y es muy protector con los niños.",
        foto: "https://placehold.co/800x400/FF8C00/FFFFFF?text=FOTO+DE+ROCKY" // URL de placeholder simple y robusta
    },
};
const DEFAULT_AVATAR = "https://placehold.co/160x160/CCCCCC/666666?text=No+Photo";

// =====================================================
// MOCK 4: API Service (Simulación de Llamadas HTTP)
// =====================================================
const getDogById = (id, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const dog = MOCK_DOG_DATA[id];
            if (dog) {
                resolve({ data: dog, status: 200 });
            } else {
                reject({ status: 404, message: 'Mascota no encontrada en el mock.' });
            }
        }, 800);
    });
};

const updateDog = (id, formData, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Convertir FormData a un objeto simple para simular la actualización
            const data = Object.fromEntries(formData.entries());
            
            if (!data.nombre || !data.raza || !data.edad) {
                console.error("[MOCK API] Error de validación: Faltan campos obligatorios.");
                return reject(new Error("Error de validación: Nombre, raza y edad son obligatorios."));
            }

            // Simular la actualización de los datos
            MOCK_DOG_DATA[id] = { ...MOCK_DOG_DATA[id], ...data };

            console.log(`[MOCK API] Mascota con ID ${id} actualizada. Nuevos datos:`, MOCK_DOG_DATA[id]);
            resolve({ status: 200, data: MOCK_DOG_DATA[id] });
        }, 1500);
    });
};


// Helper para obtener la URL
const getPhotoUrl = (path) => {
  if (!path) return DEFAULT_AVATAR;
  if (path instanceof File) return URL.createObjectURL(path);
  // En nuestro mock, 'path' es una URL string completa
  return path; 
};


const EditarMascotaCompleta = () => {
  // Se remueve la variable `API_BASE_URL` y la referencia a `import.meta.env`
  // const API_BASE_URL = import.meta.env.VITE_API_URL || ""; 
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    raza: "",
    edad: "",
    descripcion: "",
    foto: "", // String (URL) o File object
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores

  // Load dog data
  useEffect(() => {
    const loadDog = async () => {
      try {
        const { data } = await getDogById(id, token);
        setForm({
          nombre: data.nombre || "",
          raza: data.raza || "",
          edad: data.edad || "",
          descripcion: data.descripcion || "",
          foto: data.foto || "", // Carga la URL existente
        });
        setPreview(getPhotoUrl(data.foto)); // Establece la vista previa de la URL existente
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDog();
    
    // Limpieza de URL de objeto si se carga una foto antes de desmontar
    return () => {
        if (form.foto instanceof File && preview) {
            URL.revokeObjectURL(preview);
        }
    };
  }, [id, token]); // Añadir `form.foto` a las dependencias si se quisiera revocar en cada cambio de archivo, pero lo dejaremos así por simplicidad.


  const handleChange = (e) => {
    // ⚠️ MODIFICACIÓN: Usa e.target.name para actualizar el campo correcto
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limpia la URL de objeto previa si existe
      if (form.foto instanceof File) {
          URL.revokeObjectURL(preview);
      }

      // Almacena el objeto File en 'foto'
      setForm({ ...form, foto: file });
      // Crea una URL de objeto para la previsualización
      setPreview(URL.createObjectURL(file)); 
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre || !form.raza || !form.edad) {
        setError("Faltan campos obligatorios: Nombre, Raza y Edad.");
        return;
    }
    
    setSaving(true);

    try {
      const fd = new FormData();
      
      // Itera sobre el formulario para construir el FormData
      for (const [key, value] of Object.entries(form)) {
        if (key === 'foto') {
          // Si 'foto' es una instancia de File, la adjunta (nueva foto)
          if (value instanceof File) {
            fd.append('foto', value);
          }
          // Si 'foto' es una URL (string), NO la adjuntamos. Esto le indica al backend
          // que mantenga la foto existente si no se cargó una nueva.
        } else {
          // Adjunta todos los demás campos (nombre, raza, edad, descripcion)
          fd.append(key, value);
        }
      }
      
      await updateDog(id, fd, token);
      
      // Navega a la vista de detalles después de guardar
      navigate(`/dashboard/mis-mascotas/${id}`);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600 font-semibold">Cargando datos...</p>
        </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
        `}</style>
      <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">Editar Mascota</h1>

          <div className="shadow-2xl border-t-8 border-orange-500 bg-white rounded-xl overflow-hidden">
            <div className="space-y-6 p-6">
              
              {/* Mensaje de Error */}
              {error && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-xl font-medium border border-red-300">
                      {error}
                  </div>
              )}
              
              {/* Preview */}
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl shadow-lg border-2 border-gray-100 transition duration-300">
                <img
                  src={preview || DEFAULT_AVATAR}
                  alt="Preview de la Mascota"
                  // CLASE MODIFICADA: de 'object-cover' a 'object-contain'
                  // Para que la imagen se adapte sin cortar, dejando espacios si es necesario.
                  className="max-h-full max-w-full object-contain rounded-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_AVATAR }}
                />
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Upload */}
                  <div>
                    <label className="font-semibold text-sm block mb-1">Cambiar Imagen</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFile} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                    />
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="font-semibold text-sm block mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del canino"
                      className="border border-gray-300 p-3 rounded-xl w-full focus:ring-orange-500 focus:border-orange-500 transition duration-150 shadow-sm"
                    />
                  </div>

                  {/* Raza */}
                  <div>
                    <label className="font-semibold text-sm block mb-1">Raza</label>
                    <input
                      type="text"
                      name="raza"
                      value={form.raza}
                      onChange={handleChange}
                      placeholder="Raza"
                      className="border border-gray-300 p-3 rounded-xl w-full focus:ring-orange-500 focus:border-orange-500 transition duration-150 shadow-sm"
                    />
                  </div>

                  {/* Edad */}
                  <div>
                    <label className="font-semibold text-sm block mb-1">Edad</label>
                    <input
                      type="number"
                      name="edad"
                      value={form.edad}
                      onChange={handleChange}
                      placeholder="Edad en años"
                      min="0"
                      className="border border-gray-300 p-3 rounded-xl w-full focus:ring-orange-500 focus:border-orange-500 transition duration-150 shadow-sm"
                    />
                  </div>

                  {/* Descripcion */}
                  <div>
                    <label className="font-semibold text-sm block mb-1">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Describe a tu mascota"
                      rows="3"
                      className="border border-gray-300 p-3 rounded-xl w-full focus:ring-orange-500 focus:border-orange-500 transition duration-150 shadow-sm"
                    />
                  </div>

                  {/* Botón de guardar */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 text-lg bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:shadow-none transform hover:scale-[1.005]"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
              </form>
            </div>
          </div>
      </div>
    </div>
  );
};

export default EditarMascotaCompleta;