import { createRestaurante, deleteRestaurante, getRestaurante, patchRestaurante } from "./restaurante.controller";
import {Router} from 'express';
import authenticateToken from '../autorizacion';
const router = Router();

// Endpoint GET /prueba
// Ruta para obtener restaurante por ID
router.get('/restaurante/:id', getRestaurante);

// Ruta para obtener restaurante por categoría
router.get('/restaurante/categoria/:categoria', getRestaurante);

// Ruta para obtener restaurante por nombre similar
router.get('/restaurante/nombre/:nombre', getRestaurante);

// Endpoint POST /prueba 
router.post('/restaurante', authenticateToken, createRestaurante);

// Endpoint PATCH /prueba
router.patch('/restaurante/:id', authenticateToken, patchRestaurante);

// Endpoint DELETE /prueba
router.delete('/restaurante/:id', authenticateToken, deleteRestaurante);


export default router;