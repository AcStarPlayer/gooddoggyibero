import { useEffect, useState } from "react";
import api from "../services/api";
import { isAdmin, getToken } from "../utils/auth";
// Importamos solo lo necesario para el ejemplo, AppleIcon no se usa
// import { AppleIcon } from "lucide-react"; 

// ===============================================================
// MOCKS para simular la API de Reviews (Conexión)
// Reemplaza esto con tu API real de reviews si existe.
// ===============================================================
const MOCK_REVIEWS_DB = [
    { id: 'vet-1', reviews: [{ id: 101, userName: "Usuario 1", rating: 5, text: "Excelente atención." }] },
    { id: 'vet-2', reviews: [{ id: 201, userName: "Usuario 2", rating: 3, text: "Podría mejorar la espera." }] },
];

const getVetReviews = (vetId) => {
    return MOCK_REVIEWS_DB.find(db => db.id === vetId)?.reviews || [];
};

const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
};

const addReviewToApi = async (vetId, newReview) => {
    await new Promise(r => setTimeout(r, 500)); // Simula la latencia de la API
    
    // 1. Encuentra o crea la entrada en la DB mock
    let vetEntry = MOCK_REVIEWS_DB.find(db => db.id === vetId);
    if (!vetEntry) {
        vetEntry = { id: vetId, reviews: [] };
        MOCK_REVIEWS_DB.push(vetEntry);
    }

    // 2. Agrega la reseña
    vetEntry.reviews.push({ 
        ...newReview, 
        id: Date.now(), 
        userName: "Tú (Usuario Logueado)", // Sustituir por el nombre real del usuario
    });

    return { success: true };
};

// ===============================================================
// COMPONENTES AUXILIARES (Integrados de la respuesta anterior)
// ===============================================================

// 🌟 Componente StarRating
const StarRating = ({ rating, size = 'text-lg', maxStars = 5 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`flex items-center text-yellow-500 ${size} mt-1 mb-2`}>
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
            {hasHalfStar && <span className="opacity-50">★</span>} 
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
            <span className="text-sm text-gray-600 ml-2 font-semibold">({rating.toFixed(1)})</span>
        </div>
    );
};

// 💬 Componente ReviewModal
const ReviewModal = ({ vetId, vetName, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (rating === 0 || reviewText.trim().length < 10) {
            setError(rating === 0 ? "Selecciona una calificación." : "La reseña debe tener al menos 10 caracteres.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await addReviewToApi(vetId, { rating, text: reviewText });
            onReviewSubmitted(); 
            onClose();
        } catch (err) {
            setError("Error al enviar la reseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
                <h3 className="text-2xl font-bold mb-4 border-b pb-2">Dejar Reseña para {vetName}</h3>
                
                <label className="block text-gray-700 font-semibold mb-2">Tu Calificación:</label>
                <div className="flex text-3xl text-gray-300 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span 
                            key={star} 
                            onClick={() => setRating(star)} 
                            className={`cursor-pointer transition-colors duration-150 ${star <= rating ? 'text-yellow-500' : 'hover:text-yellow-300'}`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-4 text-xl font-bold text-gray-600">{rating > 0 ? `${rating}/5` : ''}</span>
                </div>

                <label className="block text-gray-700 font-semibold mb-2">Tu Comentario:</label>
                <textarea 
                    value={reviewText} 
                    onChange={(e) => setReviewText(e.target.value)} 
                    placeholder="Escribe tu experiencia aquí..." 
                    rows="4" 
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-blue-500"
                ></textarea>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} disabled={loading} className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400">Cancelar</button>
                    <button onClick={handleSubmit} disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-150">
                        {loading ? "Enviando..." : "Enviar Reseña"}
                    </button>
                </div>
            </div>
        </div>
    );
};


// 🏥 Componente VeterinariaCard (Mejorado con Reseñas)
const VeterinariaCard = ({ vet, admin, onEdit, onDelete, onOpenReview }) => {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviews, setShowReviews] = useState(false);

    // Cargar reviews específicas para esta veterinaria
    useEffect(() => {
        setLoadingReviews(true);
        // 💡 CONEXIÓN: Usamos el ID de la veterinaria para obtener sus reseñas
        const vetReviews = getVetReviews(vet._id); 
        setReviews(vetReviews);
        setLoadingReviews(false);
    }, [vet._id]);

    const rating = calculateAverageRating(reviews);

    return (
        <div className="bg-white shadow-lg rounded-xl p-4 border border-teal-100 hover:shadow-xl transition flex flex-col justify-between h-full">
            <div>
                <h3 className="font-bold text-xl text-teal-700 mb-1">{vet.nombre}</h3>
                
                {/* Calificación y número de reseñas */}
                {loadingReviews ? (
                    <p className="text-sm text-gray-400">Cargando calificación...</p>
                ) : (
                    <>
                        <StarRating rating={rating} />
                        <p className="text-sm text-gray-600">({reviews.length} reseñas)</p>
                    </>
                )}
                
                <p className="text-gray-600 mt-2">
                    <strong>Dirección:</strong> {vet.direccion || "Sin dirección"}
                </p>
                <p className="text-gray-600">
                    <strong>Contacto:</strong> {vet.contacto || "No disponible"}
                </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
                {/* Botón para abrir el modal de reseña */}
                <button 
                    onClick={() => onOpenReview(vet._id, vet.nombre)}
                    className="w-full mb-2 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-150 text-sm"
                >
                    Dejar Reseña/Valoración
                </button>
                
                {/* Botón para ver reseñas */}
                {reviews.length > 0 && (
                    <button 
                        onClick={() => setShowReviews(!showReviews)}
                        className="w-full mb-2 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150 text-sm"
                    >
                        {showReviews ? 'Ocultar Reseñas' : `Ver ${reviews.length} Reseñas`}
                    </button>
                )}

                {/* Reseñas (sección colapsable) */}
                {showReviews && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                        {reviews.map(review => (
                             <div key={review.id} className="p-2 border-b last:border-b-0">
                                <p className="font-semibold text-xs text-gray-800">{review.userName}</p>
                                <StarRating rating={review.rating} size="text-xs" />
                                <p className="text-xs italic text-gray-700">"{review.text}"</p>
                             </div>
                        ))}
                    </div>
                )}
                
                {/* Botones de Administración (solo visible para admin) */}
                {admin && (
                    <div className="flex gap-2 mt-3 justify-center">
                        <button
                            onClick={() => onEdit(vet._id)}
                            className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(vet._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// ===============================================================
// 🚀 COMPONENTE PRINCIPAL DirectorioVeterinarias
// ===============================================================

export default function DirectorioVeterinarias() {
    const [vets, setVets] = useState([]);
    const admin = isAdmin();
    const [loading, setLoading] = useState(true);

    // Estado para el modal de reseñas
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVet, setSelectedVet] = useState(null);

    // Función para obtener las veterinarias de la API
    const fetchVets = async () => {
        setLoading(true);
        try {
            // 💡 CONEXIÓN: Usamos tu endpoint real para obtener la lista
            const res = await api.get("http://localhost:5000/api/veterinarias");
            setVets(res.data);
        } catch (error) {
            console.error("Error al cargar veterinarias:", error);
            setVets([]);
        } finally {
            setLoading(false);
        }
    };

    // 💡 CONEXIÓN: Recargamos veterinarias y/o reseñas
    const handleRecargaDatos = () => {
        fetchVets();
        // Nota: Las reseñas se recargan internamente en la VeterinariaCard cuando se montan.
        // Si queremos forzar un re-render completo para que las tarjetas se actualicen:
        // Podríamos usar un estado de "key" o forzar un re-mount del componente.
    };

    useEffect(() => {
        fetchVets();
    }, []);

    // ----------------------------------------------------
    // LÓGICA CRUD (Mantenida de tu código original)
    // ----------------------------------------------------
    const handleAdd = async () => {
        const nombre = prompt("Nombre de la veterinaria:");
        if (!nombre) return;
        await api.post(
            "http://localhost:5000/api/veterinarias",
            { nombre, direccion: prompt("Dirección:") || "Sin dirección", contacto: prompt("Contacto:") || "No disponible" },
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        fetchVets();
    };

    const handleEdit = async (id) => {
        const nuevoNombre = prompt("Nuevo nombre:");
        if (!nuevoNombre) return;
        // Asumiendo que también quieres actualizar la dirección y contacto
        const nuevaDireccion = prompt("Nueva dirección:");
        const nuevoContacto = prompt("Nuevo contacto:");
        
        await api.put(
            `http://localhost:5000/api/veterinarias/${id}`,
            { nombre: nuevoNombre, direccion: nuevaDireccion, contacto: nuevoContacto },
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        fetchVets();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta veterinaria?")) return;
        await api.delete(`http://localhost:5000/api/veterinarias/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        fetchVets();
    };

    // ----------------------------------------------------
    // LÓGICA DE RESEÑAS
    // ----------------------------------------------------
    const handleOpenReview = (vetId, vetName) => {
        setSelectedVet({ id: vetId, name: vetName });
        setModalOpen(true);
    };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b-4 border-teal-500 pb-2">
                Directorio de Veterinarias
            </h2>
            
            {loading && <p className="text-center py-10 text-xl text-teal-600">Cargando directorio...</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vets.map((vet) => (
                    <VeterinariaCard
                        key={vet._id}
                        vet={{ ...vet, _id: vet._id }} // Aseguramos que el ID se pasa como _id para la mock DB
                        admin={admin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onOpenReview={handleOpenReview}
                    />
                ))}
            </div>

            {admin && (
                <button
                    onClick={handleAdd}
                    className="mt-8 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold hover:bg-green-700 transition"
                >
                    + Agregar Veterinaria
                </button>
            )}

            {/* Modal de Reseña */}
            {modalOpen && selectedVet && (
                <ReviewModal
                    vetId={selectedVet.id}
                    vetName={selectedVet.name}
                    onClose={() => { setModalOpen(false); setSelectedVet(null); }}
                    // 💡 CONEXIÓN: Al enviar la reseña, recargamos la lista para actualizar calificaciones
                    onReviewSubmitted={handleRecargaDatos} 
                />
            )}
        </div>
    );
}