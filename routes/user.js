const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

// Show SignUp form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Handle SignUp
router.post("/register", wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "🎉 Welcome to EduRadar!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
}));


router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
}),
 wrapAsync(async (req, res) => {
//   const { username, password } = req.body;
//   const foundUser = await User.findAndValidate(username, password);

//   if (foundUser) {
//     req.session.user_id = foundUser._id;
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
//   } else {
//     req.flash("error", "Invalid username or password");
//     res.redirect("/login");
//   }
 }));

 router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
