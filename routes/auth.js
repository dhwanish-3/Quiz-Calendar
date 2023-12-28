const express = require("express");
const authController = require("../controllers/auth");
const googleController = require("../controllers/google_auth");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/is-logged", authController.isLoggedIn);
router.get("/logout", authController.logout);

router.post("/google-signin", googleController.googleSignIn);

module.exports = router;
