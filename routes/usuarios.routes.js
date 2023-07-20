const express = require("express");
const UsuariosController = require("../controllers/usuarios.controller");

const router = express.Router();
router.get("/", UsuariosController.findAll); 


module.exports = router;