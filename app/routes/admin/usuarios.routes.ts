import express from 'express';
import * as UsuariosAdminController from '../../controllers/admin/usuarios.controller';
import { checkRole } from '../../middleware/check-role';
import { checkAuth } from '../../middleware/check-auth';


const router = express.Router();
router.get("/", checkAuth, checkRole, UsuariosAdminController.findAll);


export default router;