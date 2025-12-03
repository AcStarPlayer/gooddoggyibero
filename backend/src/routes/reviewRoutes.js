const express = require("express");
const router = express.Router();
const Review = require("../models/review.model");
const Veterinaria = require("../models/veterinaria.model");
const auth = require("../middlewares/auth.middleware");

// ➤ Crear reseña
router.post("/", auth, async (req, res) => {
  try {
    const { vetId, rating, comment } = req.body;

    const nueva = await Review.create({
      vetId,
      userId: req.userId,
      rating,
      comment
    });

    res.json({ ok: true, review: nueva });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ➤ Obtener reseñas por veterinaria
router.get("/:vetId", async (req, res) => {
  try {
    const reviews = await Review.find({ vetId: req.params.vetId })
      .populate("userId", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Obtener promedio
router.get("/:vetId/average", async (req, res) => {
  try {
    const reviews = await Review.find({ vetId: req.params.vetId });

    if (reviews.length === 0)
      return res.json({ average: 0 });

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    res.json({ average: (sum / reviews.length).toFixed(1) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
