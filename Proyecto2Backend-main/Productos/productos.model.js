const mongoose = require('mongoose');

const ProductoSchema = moongose.Schema({
  restaurante: {
      type: Number,
      required: true
  },
  nombre: {
      type: String,
      required: true,
      minLength: 2
  },
  categoria: {
      type: [String],
      required: true
  },
  descripcion: {
      type: String,
      required: true,
      minLength: 5
  },
  ingredientes: {
      type: [String],
      min: 1
  },
  disponibilidad: {
      type: Boolean,
      default: true
  },
  precio: {
      type: Number,
      required: true,
      min: 0
  },
  foto: {
      type: String, // La url de la foto del producto
      validate: () => {
          // Validar que la URL sea válida
          return true;
      }
  },
  habilitado: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('producto', productoSchema);
