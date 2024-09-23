const express = require("express")
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router()
const userController = require("../controllers/userController")

router.post("/signup", userController.createUser)

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router