import express from 'express';
import authController from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, resetPasswordEmailSchema, resetPasswordSchema } from '../schemas/authSchemas.js'; // Yeni şemayı içe aktar

const authRouter = express.Router();

// POST /auth/register
authRouter.post('/register', validateBody(registerSchema), authController.register);

// POST /auth/login
authRouter.post('/login', validateBody(loginSchema), authController.login);

// POST /auth/refresh
authRouter.post('/refresh', authController.refresh);

// POST /auth/logout
authRouter.post('/logout', authController.logout);

// POST /auth/send-reset-email
authRouter.post('/send-reset-email', validateBody(resetPasswordEmailSchema), authController.sendResetEmail);

// Yeni rota: POST /auth/reset-pwd
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), authController.resetPassword);

export default authRouter;
