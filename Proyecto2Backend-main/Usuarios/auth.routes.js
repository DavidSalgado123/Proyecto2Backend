import express from 'express';
import { loginUser } from './auth.controller';
import { verificar2FA } from './auth.controller';

const router = express.Router();

router.post('/login', loginUser);
router.post('/verificar-2fa', verificar2FA);

export default router;
