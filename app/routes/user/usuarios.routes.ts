// const express = require("express");
import express from 'express';
// const UsuariosController = require("../../controllers//user/usuarios.controller");
// import * as UsuariosController from '../../controllers/user/usuarios.controller';
// import findAll from '../../controllers/user/usuarios.controller';
// const checkAuth =  require("../../middleware/check-auth");
import { checkAuth } from '../../middleware/check-auth';

const router = express.Router();
// router.get("/", UsuariosController.findAll);  //checkAuth
// router.get("/", findAll);  //checkAuth

// module.exports = router;
export default router;