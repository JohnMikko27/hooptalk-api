const express = require("express")
const passport = require("passport");
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
    console.log("logged out")
    res.redirect("/");
  });
});

module.exports = router