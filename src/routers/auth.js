import express from 'express';
import authController from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

// POST /auth/register
authRouter.post('/register', validateBody(registerSchema), authController.register);

// POST /auth/login
authRouter.post('/login', validateBody(loginSchema), authController.login);

// POST /auth/refresh
authRouter.post('/refresh', authController.refresh);

// POST /auth/logout
authRouter.post('/logout', authController.logout);

export default authRouter;
