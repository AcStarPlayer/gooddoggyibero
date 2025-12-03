const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// indice para consultas por owner
PostSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
