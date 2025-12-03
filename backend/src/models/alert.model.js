// ============================================
// 📁 models/alert.model.js
// Modificaciones: índices, validaciones ligeras y transform toJSON
// No se cambió la semántica ni nombres de campos para no romper la lógica.
// ============================================

const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  lastSeenLocation: {
    type: String,
    trim: true
  },
  // lat / lng numéricos con validación de rango simple
  latitude: {
    type: Number,
    // validación opcional: latitud válida entre -90 y 90
    validate: {
      validator: (v) => v === undefined || (v >= -90 && v <= 90),
      message: props => `Latitude (${props.value}) fuera de rango (-90..90)`
    }
  },
  longitude: {
    type: Number,
    // validación opcional: longitud válida entre -180 y 180
    validate: {
      validator: (v) => v === undefined || (v >= -180 && v <= 180),
      message: props => `Longitude (${props.value}) fuera de rango (-180..180)`
    }
  },
  photoUrl: {
    type: String
  },
  status: {
    type: String,
    // Mantengo tus valores en español ('activa' / 'resuelta') — importante para que controllers y rutas sigan funcionando.
    enum: ['activa', 'resuelta'],
    default: 'activa'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// -----------------------------
// Índices recomendados (no rompen la lógica):
// 1) Query frecuente: buscar alertas activas por owner / status.
// 2) Búsqueda de texto: petName + description (útil para buscar "perro marrón", "cachorro", etc.)
// -----------------------------
AlertSchema.index({ owner: 1, status: 1 });
AlertSchema.index({ petName: 'text', description: 'text' });

// -----------------------------
// Transformación JSON: cuando conviertas el documento a JSON (res.json),
// devuelve `id` en vez de `_id` y elimina `__v` para respuestas más limpias.
// Esto no cambia la DB ni la lógica del servidor, solo la forma de serializar.
// -----------------------------
AlertSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString?.(); // añade id string
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Exporta el modelo sin cambiar nombre (mantener compatibilidad)
module.exports = mongoose.model('Alert', AlertSchema);
