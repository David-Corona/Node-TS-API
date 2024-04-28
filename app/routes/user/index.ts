import express from 'express';

// Import user-related route files
import authRoutes from './auth.routes';
import usuariosRoutes from './usuarios.routes';

const userRouter = express.Router();

// Mount the individual route files on the userRouter
userRouter.use('/auth', authRoutes);
userRouter.use('/usuarios', usuariosRoutes);

export default userRouter;