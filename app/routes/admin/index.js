const express = require('express');
const adminRouter = express.Router();

// Import admin-related route files
const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');

// Mount the individual route files on the adminRouter
adminRouter.use('/auth', authRoutes);
adminRouter.use('/usuarios', usuariosRoutes);

module.exports = adminRouter;