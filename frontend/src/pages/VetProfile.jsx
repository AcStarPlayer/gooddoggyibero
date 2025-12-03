import { useState, useEffect } from "react";
import api from "../services/api";
import Stars from "../components/Stars";

export default function VetProfile({ vetId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const cargarReviews = () =>
    api.get(`/reviews/${vetId}`).then(res => setReviews(res.data));

  useEffect(() => {
    cargarReviews();
  }, []);

  const enviarReview = async () => {
    await api.post("/reviews", { vetId, rating, comment });
    cargarReviews();
  };

  return (
    <div>
      <h1>Reseñas</h1>

      <select onChange={e => setRating(e.target.value)}>
        {[1,2,3,4,5].map(n => (
          <option key={n} value={n}>{n} estrella(s)</option>
        ))}
      </select>

      <textarea
        placeholder="Comentario..."
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={enviarReview}>Enviar reseña</button>

      <hr />

      {reviews.map(r => (
        <div key={r._id} className="review">
          <Stars rating={r.rating} />
          <p><strong>{r.userId?.name}</strong></p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}


