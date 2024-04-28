import express from 'express';

// Import admin-related route files
import authRoutes from './auth.routes';
import usuariosRoutes from './usuarios.routes';

const adminRouter = express.Router();

// Mount the individual route files on the adminRouter
adminRouter.use('/auth', authRoutes);
adminRouter.use('/usuarios', usuariosRoutes);

export default adminRouter;