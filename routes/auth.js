const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.createUser);

router.post("/login", passport.authenticate("local"), authController.getToken);

router.get("/login", (req, res) => res.send("login route"));

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Successfully logged out"});
  });
});

module.exports = router;