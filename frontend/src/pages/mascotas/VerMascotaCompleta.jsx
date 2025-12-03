import React, { useEffect, useState, createContext, useContext } from "react";
// Se eliminan las importaciones relativas a archivos externos y se usan mocks

// =====================================================
// MOCK 1: useAuth (Simulación de Autenticación)
// =====================================================
const MOCK_TOKEN = "MOCK-AUTH-TOKEN-7890";
const useAuth = () => ({
  token: MOCK_TOKEN,
});

// =====================================================
// MOCK 2: useParams & useNavigate (Simulación de Router)
// =====================================================
// Usaremos un ID de mascota fijo para la demostración
const MOCK_ID = "dog-456"; 
const useParams = () => ({ id: MOCK_ID });
const useNavigate = () => (path) => {
  console.log(`[MOCK Navegación] Se intentó navegar a: ${path}`);
  // Aquí podríamos añadir un mensaje visible para el usuario si fuera necesario.
};

// =====================================================
// MOCK 3: Datos de Mascota de Simulación
// =====================================================
const MOCK_DOG_DATA = {
    "dog-456": {
        id: "dog-456",
        nombre: "Rocky",
        raza: "Pastor Alemán",
        edad: 3,
        descripcion: "Rocky es un perro guardián muy leal, adora las pelotas y es muy protector con los niños.",
        tamano: "Grande",
        status: "normal",
        // URL de placeholder simple y robusta
        foto: "https://placehold.co/800x400/FF8C00/FFFFFF?text=FOTO+DE+ROCKY" 
    },
    // Podrías añadir más datos simulados si fuera necesario
};

// =====================================================
// MOCK 4: API Service (Simulación de Llamadas HTTP)
// =====================================================

const getDogById = (id, token) => {
    console.log(`[MOCK API] Obteniendo perro por ID: ${id}. Usando token: ${token.substring(0, 10)}...`);
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

const deleteDog = (id, token) => {
    console.log(`[MOCK API] Eliminando perro con ID: ${id}. Usando token: ${token.substring(0, 10)}...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulamos la eliminación (solo en el log)
            console.log(`[MOCK API] Mascota con ID ${id} eliminada exitosamente (simulado).`);
            resolve({ status: 204 });
        }, 1500);
    });
};


// =====================================================
// Componente Principal
// =====================================================
const VerMascotaCompleta = () => {
  const { id } = useParams(); // ID de mascota mock
  const navigate = useNavigate();
  const { token } = useAuth(); // Token mock

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para el modal de eliminación

  useEffect(() => {
    // Usamos console.log para mostrar el entorno de ejecución
    console.log("[ENV] API_BASE_URL no disponible en este entorno, se usará URL fija."); 
    
    const loadDog = async () => {
      try {
        // Usando el mock
        const { data } = await getDogById(id, token);
        setDog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDog();
  }, [id, token]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      // Usando el mock
      await deleteDog(id, token);
      
      // Mostrar mensaje de éxito antes de navegar
      alert("Mascota eliminada exitosamente (simulado)."); 
      
      navigate("/dashboard/mis-mascotas");
    } catch (err) {
      console.error(err);
      // Usamos alert simple ya que no tenemos Toast
      alert("Error al eliminar la mascota."); 
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4 text-orange-600 font-semibold">Cargando...</p>
    </div>
  );

  if (!dog) return <p className="text-center py-10 text-xl font-semibold text-red-500">Mascota no encontrada</p>;

  // Dado que usamos mock data con URL completa, no necesitamos la función getPhotoUrl.

  return (
    <div className="max-w-3xl mx-auto p-4 transition-opacity duration-500" style={{ opacity: 1 }}>
      <div className="shadow-2xl border-t-8 border-orange-500 bg-white rounded-xl overflow-hidden">
        <div className="p-6 space-y-4">
          
          {/* ⚠️ FOTO DEL CANINO INDIVIDUAL (Uso directo de la URL mock) */}
          <img
            src={dog.foto}
            alt={dog.nombre}
            // Clases de Tailwind que fuerzan el tamaño
            className="w-full h-96 object-cover rounded-xl shadow-lg border-2 border-gray-100 transition transform hover:scale-[1.01] duration-300"
            // Atributo de fallback por si la imagen no carga
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/CCCCCC/666666?text=FOTO+NO+DISPONIBLE" }}
          />

          <h1 className="text-4xl font-extrabold text-gray-800 pt-4 text-center">{dog.nombre}</h1>

          <p className="text-gray-600 italic border-l-4 border-orange-300 pl-3 pt-2">{dog.descripcion}</p>
          
          {/* Datos principales */}
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex flex-col">
                <strong className="text-sm text-gray-600">Raza:</strong> 
                <span className="font-semibold text-lg text-gray-800">{dog.raza}</span>
            </div>
            <div className="flex flex-col">
                <strong className="text-sm text-gray-600">Edad:</strong> 
                <span className="font-semibold text-lg text-gray-800">{dog.edad} años</span>
            </div>
            {dog.tamano && (
                <div className="flex flex-col col-span-2 sm:col-span-1">
                    <strong className="text-sm text-gray-600">Tamaño:</strong> 
                    <span className="font-semibold text-lg text-gray-800">{dog.tamano}</span>
                </div>
            )}
            
            {/* Estado */}
             {dog.status && (
                <div className="col-span-2 flex flex-col">
                    <strong className="text-sm text-gray-600">Estado:</strong> 
                    <span 
                        className={`mt-1 px-3 py-1 rounded-full text-white text-sm font-bold w-fit shadow ${
                            dog.status === "lost"
                                ? "bg-red-600"
                                : dog.status === "found"
                                ? "bg-green-600"
                                : "bg-blue-500"
                        }`}
                    >
                        {dog.status === "lost" ? "Perdido" : dog.status === "found" ? "Encontrado" : "Normal"}
                    </span>
                </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">

            {/* EDITAR Button (Simulado) */}
            <button
              className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.01]"
              onClick={() =>
                navigate(`/dashboard/mis-mascotas/${id}/editar`)
              }
            >
              Editar Información
            </button>

            {/* ELIMINAR Button (Abre Modal Simulado) */}
            <button 
                className="w-1/2 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-[1.01]"
                onClick={() => setShowDeleteModal(true)}
            >
                Eliminar Mascota
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de Confirmación de Eliminación (Simulado) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    ¿Eliminar mascota?
                </h3>
                <p className="text-gray-600 mb-6">
                    Esta acción no se puede deshacer. Se eliminará a **{dog.nombre}** del sistema permanentemente.
                </p>

                <div className="flex justify-end gap-3">
                    <button 
                        className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 disabled:bg-red-400"
                        onClick={handleDelete} 
                        disabled={deleting}
                    >
                        {deleting ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default VerMascotaCompleta;