const mongoose = require('mongoose');

const restauranteSchema = mongoose.Schema({
    idRestaurante: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        minLength: 2,
        unique: true
    },
    categorias: [{
        type: String, // Lista de categorías del restaurante
        required: true
    }],
    usadomiciliariospropios: {
        type: Boolean,
        required: true
    },
    costoenviopropio: {
        type: Number,
        validate: ()=> {
            //validar que el costo sea mayor o igual a 0
            return true
        }
    },
    tiempoEstimadoEnvio: {
        type: String,
        required: true
    },
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Administrador',
        required: true
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 5
    },
    ubicaciones: [{
        direccion: String,
        rangoservicio: Number // El radio en kilometros a partir de la ubicación
    }],
    menu: [{
        categoria: String,
        platos: [{
            nombre: String,
            descripcion: String,
            precio: Number,
            min: 1
        }]
    }],
    habilitado: {
        type: Boolean,
        default: true
    }
  })
  

export default mongoose.model('restaurante', restauranteSchema);
