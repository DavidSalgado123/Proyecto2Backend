
import Usuario from './usuarios.model';
import bcrypt from 'bcrypt';


export async function getUsuario(req, res) {
  try {
    const { id } = req.query;
    let usuario;

    // Acceso al usuario autenticado a través de req.user
    const usuarioAutenticado = req.user;

    console.log('Usuario autenticado:', usuarioAutenticado);

    if (id) {
      // Buscar usuario por ID
      usuario = await Usuario.findById(id);
    } else {
      // Devuelve los datos del usuario autenticado
      usuario = usuarioAutenticado;
    }

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
}


export async function createUsuario(req, res) {
  try {
    const { nombre, apellido, direccion, fotoPerfil, telefono, correo, contrasena, fechaDeNacimiento, esAdministrador, habilitado } = req.body;

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const usuario = new Usuario({ 
      nombre,
      apellido,
      direccion,
      fotoPerfil,
      telefono,
      correo,
      contrasena: hashedPassword,  // Almacena la contraseña hasheada
      fechaDeNacimiento,
      esAdministrador,
      habilitado
    });

    const resultado = await usuario.save();
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear el usuario', error: err.message });
  }
}


export async function patchUsuario(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Accede al ID del usuario autenticado a través de req.user
    const usuarioAutenticado = req.user;
    const usuarioAutenticadoId = usuarioAutenticado.id;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verifica si el usuario autenticado es propietario del usuario que intenta actualizar
    if (usuario._id.toString() !== usuarioAutenticadoId) {
      return res.status(403).json({ mensaje: 'No tienes permisos para actualizar este usuario' });
    }

    // Actualizar los datos del usuario con los proporcionados en updateData
    for (const key in updateData) {
      usuario[key] = updateData[key];
    }

    const resultado = await usuario.save();

    res.status(200).json({ mensaje: 'Usuario actualizado exitosamente', usuario: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: err.message });
  }
}


export async function deleteUsuario(req, res) {
  try {
    const { id } = req.params;

    // Accede al ID del usuario autenticado a través de req.user
    const usuarioAutenticado = req.user;
    const usuarioAutenticadoId = usuarioAutenticado.id;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verifica si el usuario autenticado es propietario del usuario que intenta inhabilitar
    if (usuario._id.toString() !== usuarioAutenticadoId) {
      return res.status(403).json({ mensaje: 'No tienes permisos para inhabilitar este usuario' });
    }

    usuario.habilitado = false;
    await usuario.save();

    res.status(200).json({ mensaje: 'Usuario inhabilitado exitosamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al inhabilitar el usuario', error: err.message });
  }
}

