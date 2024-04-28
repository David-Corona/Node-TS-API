import express from 'express';
import * as AdminAuthController from '../../controllers/admin/auth.controller';
import * as UserAuthController from '../../controllers/user/auth.controller';
import { checkRole } from '../../middleware/check-role';


const router = express.Router();
router.post("/registro", AdminAuthController.registro);
router.post("/login", checkRole, UserAuthController.login);
router.post("/refresh-token", UserAuthController.refreshToken);
router.post("/logout", checkRole, UserAuthController.logout);
router.post("/forgot-password", checkRole, UserAuthController.forgotPassword);
router.post("/reset-password", checkRole, UserAuthController.resetPassword);


export default router;