const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();
router.post("/registro", AuthController.registro);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

module.exports = router;