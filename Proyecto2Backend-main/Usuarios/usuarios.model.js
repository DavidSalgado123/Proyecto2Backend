const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: 2,
  },
  apellido: {
    type: String,
    required: true,
    minLength: 2,
  },
  direccion: {
    calle: String,
    numero: String,
    ciudad: String,
    codigoPostal: String,
    pais: String,
    required: true,
  },
  fotoPerfil: {
    type: String, // la url
    validate: () => {
      // Validar que la URL sea válida
      return true;
    },
  },
  telefono: {
    type: String,
    required: true,
    unique: true,
    validate: () => {
      // Validar que el telefono sea un telefono valido.
      return true;
    },
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Convierte el correo electrónico a minúsculas antes de almacenar
    validate: () => {
      // Validar que el correo electrónico tenga un formato correcto
      return true;
    },
  },
  contrasena: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 24,
    select: false, // Evitar que la contraseña se envíe en las consultas por defecto
  },
  fechaDeNacimiento: {
    type: Date,
    required: true,
    validate: () => {
      // La fecha de nacimiento debe ser en el pasado
      return true;
    },
  },
  esAdministrador: {
    type: Boolean,
    default: false,
  },
  tokenAcceso: {
    type: String,
  },
  habilitado: {
    type: Boolean,
    default: true,
  },
  autenticacionDosFactores: {
    type: Boolean,
    default: false,
  },
  codigo2FA: String,
  expiracion2FA: Date,
});

// Middleware para hashear la contraseña antes de guardarla en la base de datos
UsuarioSchema.pre('save', async function (next) {
  try {
    // Solo hashea la contraseña si ha sido modificada
    if (!this.isModified('contrasena')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.contrasena, 10);
    this.contrasena = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model('Usuario', UsuarioSchema);
