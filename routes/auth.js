const express = require("express");
const router = express.Router();
const { setToken, verifyToken, 
  createUser, getToken, getUser, updateUser } = require("../controllers/authController");

router.post("/signup", createUser);

router.post("/login", getToken);

router.get("/login", (req, res) => res.send("login route"));

router.get("/users/:id", setToken, verifyToken, getUser);

router.put("/users/:id", setToken, verifyToken, updateUser)

module.exports = router;