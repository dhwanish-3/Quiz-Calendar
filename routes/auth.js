const express = require("express");
const authController = require("../controllers/auth");
const dateController = require("../controllers/events")
const router = express.Router();

router.post("/login", authController.login)
router.post("/register",authController.register)
router.post("/events",dateController.getEvents)

module.exports = router;