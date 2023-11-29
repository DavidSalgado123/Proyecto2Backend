import { createUsuario, deleteUsuario, getUsuario, patchUsuario } from "./usuarios.controller";
import {Router} from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../jwtconfig';

const router = Router();

// Endpoint GET /prueba
router.get('/usuarios', authenticateToken, getUsuario);

// Endpoint POST /prueba
router.post('/usuarios', createUsuario );


// Endpoint PATCH /prueba
router.patch('/usuarios/:id', authenticateToken, patchUsuario);

// Endpoint DELETE /prueba
router.delete('/usuarios/:id', authenticateToken, deleteUsuario);

export default router;