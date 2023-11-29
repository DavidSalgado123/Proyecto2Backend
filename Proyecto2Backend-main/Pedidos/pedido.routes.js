import { createPedido, deletePedido, getPedidoPorId,getPedidosFiltrados,getPedidosNoAceptados, patchPedido } from "./pedido.controller";
import {Router} from 'express';
const router = Router();

// Endpoint GET /prueba
router.get('/pedido/id/:id', getPedidoPorId);
router.get('/pedidos', getPedidosFiltrados);
router.get('/pedidos/noaceptados', getPedidosNoAceptados);


// Endpoint POST /
router.post('/pedidos', createPedido);

// Endpoint PATCH /pedidos/:id
router.patch('/pedidos/:id', patchPedido);

// Endpoint DELETE /prueba
router.delete('/', deletePedido );

export default router;