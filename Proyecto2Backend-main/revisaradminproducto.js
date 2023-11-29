import Restaurante from '../Restaurantes/restaurante.model';

async function checkAdminOwnership(req, res, next) {
  try {
    const administradorId = req.user.id;  // ID del administrador autenticado
    const idRestaurante = req.body.idRestaurante;  // Asume que el ID del restaurante está en req.body.idRestaurante

    // Busca el restaurante por su ID y el administrador asociado
    const restaurante = await Restaurante.findOne({ _id: idRestaurante, administrador: administradorId });

    // Si no se encuentra el restaurante o no coincide con el administrador, deniega el acceso
    if (!restaurante) {
      return res.status(403).json({ mensaje: 'No tienes permisos para agregar productos a este restaurante' });
    }

    // Si todo está bien, continúa con la siguiente función en la cadena de middleware
    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar la propiedad del administrador', error: error.message });
  }
}

module.exports = checkAdminOwnership;
