// const express = require('express');
import express from 'express';

// Import user-related route files
// const authRoutes = require('./auth.routes');
// const usuariosRoutes = require('./usuarios.routes');
import authRoutes from './auth.routes';
import usuariosRoutes from './usuarios.routes';

const userRouter = express.Router();

// Mount the individual route files on the userRouter
userRouter.use('/auth', authRoutes);
userRouter.use('/usuarios', usuariosRoutes);

// module.exports = userRouter;
export default userRouter;