const express = require("express");
const UsuariosController = require("../controllers/usuarios.controller");
const checkAuth =  require("../middleware/check-auth");

const router = express.Router();
router.get("/", checkAuth, UsuariosController.findAll); 

module.exports = router;