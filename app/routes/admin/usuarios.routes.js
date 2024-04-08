const express = require("express");
const UsuariosController = require("../../controllers//user/usuarios.controller");
const checkAuth =  require("../../middleware/check-auth");
const checkRole = require("../../middleware/check-role");

const router = express.Router();
router.get("/", checkAuth, checkRole, UsuariosController.findAll); 

module.exports = router;