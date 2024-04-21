const express = require("express");
const UsuariosAdminController = require("../../controllers/admin/usuarios.controller");
const checkAuth =  require("../../middleware/check-auth");
const checkRole = require("../../middleware/check-role");

const router = express.Router();
router.get("/", UsuariosAdminController.findAll); // TODO - Añadir  checkAuth, checkRole

module.exports = router;