const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { storeReturnTo } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Show SignUp form
router.route("/register")
.get( userController.renderSignupForm)
.post(userController.signup);

router.route("/login")
.get( userController.renderLoginForm)
.post( storeReturnTo, passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
}), userController.Login);

 router.get("/logout", userController.Logout);

module.exports = router;
