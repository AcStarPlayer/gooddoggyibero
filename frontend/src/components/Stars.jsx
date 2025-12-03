export default function Stars({ rating }) {
  return (
    <div style={{ color: "#f4b400", fontSize: "20px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
