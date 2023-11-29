
import Producto from './productos.model';
import Restaurante from '../Restaurantes/restaurante.model';
import authenticateToken from '../autorizacion'; 

export async function getProducto(req, res) {
  try {
    const { id, restaurante, categoria } = req.query;

    if (id) {
      // Buscar producto por ID
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
      return res.status(200).json(producto);
    } else if (restaurante) {
      // Buscar productos por restaurante
      const productos = await Producto.find({ restaurante });
      return res.status(200).json(productos);
    } else if (categoria) {
      // Buscar productos por categoría
      const productos = await Producto.find({ categoria });
      return res.status(200).json(productos);
    } else {
      return res.status(400).json({ mensaje: 'Se requiere proporcionar ID, restaurante o categoría' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
}


export async function createProducto(req, res) {
  try {
    // Accede al usuario autenticado a través de req.user
    const administradorId = req.user.id;

    // Verifica que el administradorId existe
    if (!administradorId) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }

    const { restaurante, nombre, categoria, descripcion, ingredientes, disponibilidad, precio, foto, habilitado } = req.body;

    // Verifica la propiedad del administrador utilizando el middleware revisaradminproducto
    const restauranteAsociado = await Restaurante.findOne({ _id: restaurante, administrador: administradorId });

    // Si no se encuentra el restaurante o no coincide con el administrador, deniega el acceso
    if (!restauranteAsociado) {
      return res.status(403).json({ mensaje: 'No tienes permisos para agregar productos a este restaurante' });
    }

    // Crea el producto solo si el administradorId coincide con el administrador del restaurante del producto
    const producto = new Producto({
      restaurante,
      nombre,
      categoria,
      descripcion,
      ingredientes,
      disponibilidad,
      precio,
      foto,
      habilitado
    });

    const resultado = await producto.save();

    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear el producto', error: err.message });
  }
}


export async function patchProducto(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verifica que el usuario esté autenticado a través de JWT
    const administradorId = req.user.id;

    // Verifica si el administrador es propietario del restaurante asociado al producto
    const restauranteAsociado = await Restaurante.findOne({ _id: producto.restaurante, administrador: administradorId });

    // Si no se encuentra el restaurante o no coincide con el administrador, deniega el acceso
    if (!restauranteAsociado) {
      return res.status(403).json({ mensaje: 'No tienes permisos para actualizar este producto' });
    }

    // Actualizar los datos del producto con los proporcionados en updateData
    for (const key in updateData) {
      producto[key] = updateData[key];
    }

    const resultado = await producto.save();

    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', producto: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error: err.message });
  }
}


export async function deleteProducto(req, res) {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verifica que el usuario esté autenticado a través de JWT
    const administradorId = req.user.id;

    // Verifica si el administrador es propietario del restaurante asociado al producto
    const restauranteAsociado = await Restaurante.findOne({ _id: producto.restaurante, administrador: administradorId });

    // Si no se encuentra el restaurante o no coincide con el administrador, deniega el acceso
    if (!restauranteAsociado) {
      return res.status(403).json({ mensaje: 'No tienes permisos para inhabilitar este producto' });
    }

    // Marcar el producto como no disponible
    producto.habilitado = false;
    await producto.save();

    res.status(200).json({ mensaje: 'Producto inhabilitado exitosamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al inhabilitar el producto', error: err.message });
  }
}

