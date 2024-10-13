const express = require("express");
const passport = require("passport");
const router = express.Router();
const { setToken, verifyToken, 
  createUser, getToken, getUser } = require("../controllers/authController");

router.post("/signup", createUser);

router.post("/login", passport.authenticate("local"), getToken);

router.get("/login", (req, res) => res.send("login route"));

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Successfully logged out"});
  });
});

router.get("/users/:id", setToken, verifyToken, getUser);

module.exports = router;