const express = require("express");

const UsuariosController = require("../controllers/usuarios.controller");

const router = express.Router();

router.get("/", UsuariosController.index); //http://localhost:3000/usuarios/usuarios
router.get("/usuarios", UsuariosController.findAll); //http://localhost:3000/usuarios
// router.post("/signup", UserController.createUser);
// router.post("/login", UserController.userLogin);


module.exports = router;
