const express = require("express");
const AdminAuthController = require("../../controllers/admin/auth.controller"); 

// TODO - Check these are the same, no differences
const UserAuthController = require("../../controllers/user/auth.controller"); 

const router = express.Router();
router.post("/registro", AdminAuthController.registro);
router.post("/login", AdminAuthController.login);

// TODO: UserAuthController? Same or anything different?
router.post("/refresh-token", UserAuthController.refreshToken);
router.post("/logout", UserAuthController.logout);
router.post("/forgot-password", UserAuthController.forgotPassword);
router.post("/reset-password", UserAuthController.resetPassword);


module.exports = router;