// const express = require('express');
import express from 'express';

// Import admin-related route files
// const authRoutes = require('./auth.routes');
// const usuariosRoutes = require('./usuarios.routes');
import authRoutes from './auth.routes';
import usuariosRoutes from './usuarios.routes';

const adminRouter = express.Router();

// Mount the individual route files on the adminRouter
adminRouter.use('/auth', authRoutes);
adminRouter.use('/usuarios', usuariosRoutes);

// module.exports = adminRouter;
export default adminRouter;