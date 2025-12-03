const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: "Veterinaria", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 🔥 Solución al OverwriteModelError
module.exports = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

