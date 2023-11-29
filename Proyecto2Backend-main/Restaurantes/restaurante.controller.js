
import Restaurante from './restaurante.model';

export async function getRestaurante(req,res) {
  try {
    const { id, categoria, nombre } = req.query;

    if (id) {
      // Buscar restaurante por ID
      const restaurante = await Restaurante.findById(id);
      if (!restaurante) {
        return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
      }
      return res.status(200).json(restaurante);
    } else if (categoria) {
      // Buscar restaurantes por categoría
      const restaurantes = await Restaurante.find({ categorias: categoria });
      return res.status(200).json(restaurantes);
    } else if (nombre) {
      // Buscar restaurantes por nombre similar a la búsqueda
      const restaurantes = await Restaurante.find({ nombre: { $regex: nombre, $options: 'i' } });
      return res.status(200).json(restaurantes);
    } else {
      return res.status(400).json({ mensaje: 'Se requiere proporcionar ID, categoría o nombre' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener restaurante', error: error.message });
  }
}


// restaurante.controller.js
import Restaurante from './restaurante.model';

export async function createRestaurante(req, res) {
  try {
    // Accede al usuario autenticado a través de req.user
    const administradorId = req.user.id;

    // Verifica que el administradorId existe
    if (!administradorId) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }

    const { nombre, categorias, usadomiciliariospropios, costoenviopropio, tiempoEstimadoEnvio, calificacion, ubicaciones, menu, habilitado } = req.body;

    // Crea el restaurante solo si el administradorId coincide con el administrador del restaurante
    const restaurante = new Restaurante({
      idRestaurante,
      nombre,
      categorias,
      usadomiciliariospropios,
      costoenviopropio,
      tiempoEstimadoEnvio,
      administrador: administradorId,  // Asigna el administradorId al restaurante
      calificacion,
      ubicaciones,
      menu,
      habilitado,
    });

    const resultado = await restaurante.save();

    res.status(201).json({ mensaje: 'Restaurante creado exitosamente', restaurante: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear el restaurante', error: err.message });
  }
}


export async function patchRestaurante(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurante = await Restaurante.findById(id);

    if (!restaurante) {
      return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
    }

    // Actualizar los datos del restaurante con los proporcionados en updateData
    for (const key in updateData) {
      restaurante[key] = updateData[key];
    }

    const resultado = await restaurante.save();

    res.status(200).json({ mensaje: 'Restaurante actualizado exitosamente', restaurante: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el restaurante', error: err.message });
  }
}


export async function deleteRestaurante(req, res) {
  try {
    const { id } = req.params;

    const restaurante = await Restaurante.findById(id);

    if (!restaurante) {
      return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
    }

    restaurante.habilitado = false;
    await restaurante.save();

    res.status(200).json({ mensaje: 'Restaurante inhabilitado exitosamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al inhabilitar el restaurante', error: err.message });
  }
}
