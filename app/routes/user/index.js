const express = require('express');
const userRouter = express.Router();

// Import user-related route files
const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');

// Mount the individual route files on the userRouter
userRouter.use('/auth', authRoutes);
userRouter.use('/usuarios', usuariosRoutes);

module.exports = userRouter;