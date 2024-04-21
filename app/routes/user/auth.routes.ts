// const express = require("express");
import express from 'express';
// const AuthController = require("../../controllers/user/auth.controller");
import * as AuthController from '../../controllers/user/auth.controller';

const router = express.Router();

router.post("/registro", AuthController.registro);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// module.exports = router;
export default router;