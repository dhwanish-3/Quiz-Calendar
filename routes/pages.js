const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/home", (req, res) => {
  res.render("index");
});

router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot_password");
});

router.get("/update-password", (req, res) => {
  res.render("update_password");
});

module.exports = { router };
