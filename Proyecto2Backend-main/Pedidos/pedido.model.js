const mongoose = require('mongoose');

const pedidoSchema = mongoose.Schema({
  restaurante: {
      type: String, // Nombre del restaurante al que se le hizo pedido
      required: true
  },
  estadosPedido: {
      type: [String], // Como hay diferentes estados de pedido entonces es una lsita.
      required: true
  },
  tiempoEstimadoLlegada: {
      type: String,
      required: true
  },
  calificacionUsuario: {
      type: Number,
      min: 1,
      max: 5
  },
  domiciliario: {
      type: String, //Nombre del domiciliario
      telefono: String,
      foto: String, //La url
      required: true
  },
  valorTotal: {
      type: Number,
      required: true,
      min: 1 //Pongo 1 como mínimo ya que el pedido tiene que ser mayor que 0 pesos
  },
  productos: [{
      nombre: String,
      descripcion: String,
      precio: Number,
      min: 1
  }],
  habilitado: {
    type: Boolean,
    default: true
  } 
})

export default mongoose.model('pedido', pedidoSchema);
