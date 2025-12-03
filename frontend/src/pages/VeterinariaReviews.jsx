import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByVeterinaria } from "@/services/veterinarias";

export default function VeterinariaReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const res = await getReviewsByVeterinaria(id);
    setReviews(res);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Reseñas</h1>

      {reviews.length === 0 && <p>No hay reseñas aún.</p>}

      {reviews.map((r) => (
        <div key={r._id} className="border p-4 rounded-xl mb-3 shadow-sm bg-white">
          <p className="font-semibold">{r.usuarioNombre}</p>
          <p className="text-yellow-500">
            {"★".repeat(r.calificacion)}{"☆".repeat(5 - r.calificacion)}
          </p>
          <p>{r.comentario}</p>
        </div>
      ))}
    </div>
  );
}
