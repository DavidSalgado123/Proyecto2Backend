
import Pedido from './pedido.model';

export async function getPedidoPorId(req, res) {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el pedido', error: err.message });
  }
}
export async function getPedidosFiltrados(req, res) {
  try {
    const { usuario, enviadoPor, restaurante, fechaInicio, fechaFin } = req.query;

    const filtro = {};

    if (usuario) filtro.usuario = usuario;
    if (enviadoPor) filtro.enviadoPor = enviadoPor;
    if (restaurante) filtro.restaurante = restaurante;
    if (fechaInicio && fechaFin) {
      filtro.fechaEnvio = { $gte: fechaInicio, $lte: fechaFin };
    }

    const pedidos = await Pedido.find(filtro);

    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: err.message });
  }
}
export async function getPedidosNoAceptados(req, res) {
  try {
    const pedidosNoAceptados = await Pedido.find({ estadosPedido: 'Enviado' });

    res.status(200).json(pedidosNoAceptados);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos no aceptados', error: err.message });
  }
}


export async function createPedido(req, res) {
  try {
    const {restaurante,estadosPedido,tiempoEstimadoLlegada,calificacionUsuario,domiciliario,valorTotal,productos,habilitado} = req.body;

    const nuevoPedido = new Pedido({
      restaurante,
      estadosPedido,
      tiempoEstimadoLlegada,
      calificacionUsuario,
      domiciliario,
      valorTotal,
      productos,
      habilitado
    });

    const resultado = await nuevoPedido.save();

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: err.message });
  }
}


export async function patchPedido(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedido.estadosPedido.includes('Enviado')) {
      return res.status(400).json({ mensaje: 'No se puede modificar un pedido enviado' });
    }

    // Actualizar los datos del pedido con los proporcionados en updateData
    for (const key in updateData) {
      pedido[key] = updateData[key];
    }

    const resultado = await pedido.save();

    res.status(200).json({ mensaje: 'Pedido actualizado exitosamente', pedido: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error: err.message });
  }
}


export async function deletePedido(req, res) {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    // Verificar si el pedido ya ha sido enviado
    if (pedido.estadosPedido.includes('Enviado')) {
      return res.status(400).json({ mensaje: 'No se puede inhabilitar un pedido enviado' });
    }

    pedido.estadosPedido.push('Inhabilitado');

    const resultado = await pedido.save();

    res.status(200).json({ mensaje: 'Pedido inhabilitado exitosamente', pedido: resultado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al inhabilitar el pedido', error: err.message });
  }
}
