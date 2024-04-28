import express from 'express';
import * as UsuariosController from '../../controllers/user/usuarios.controller';
import { checkAuth } from '../../middleware/check-auth';
import { checkRole } from '../../middleware/check-role';


const router = express.Router();
router.get("/", checkAuth, checkRole, UsuariosController.findAll);


export default router;