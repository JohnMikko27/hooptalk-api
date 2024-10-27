const express = require("express");
const router = express.Router();
const { setToken, verifyToken, 
  createUser, getToken, getUser } = require("../controllers/authController");

router.post("/signup", createUser);

router.post("/login", getToken);

router.get("/login", (req, res) => res.send("login route"));

router.get("/users/:id", setToken, verifyToken, getUser);

module.exports = router;