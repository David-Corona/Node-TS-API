// const express = require("express");
import express from 'express';
// const UsuariosAdminController = require("../../controllers/admin/usuarios.controller");
import * as UsuariosAdminController from '../../controllers/admin/usuarios.controller';
// const checkAuth =  require("../../middleware/check-auth");
// const checkRole = require("../../middleware/check-role");
import { checkRole } from '../../middleware/check-role';
import { checkAuth } from '../../middleware/check-auth';

const router = express.Router();
router.get("/", UsuariosAdminController.findAll); // TODO - Añadir  checkAuth, checkRole

// module.exports = router;
export default router;