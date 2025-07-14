const User = require("../models/user");

module.exports.renderSignupForm=async(req, res) => {
  res.render("users/register");
};

module.exports.signup=async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); 
    }
    req.flash("success", "Welcome to EduRadar!");
    res.redirect("/listings");
  });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm=async(req, res) => {
  res.render("users/login");
};

module.exports.Login= async (req, res) => {
  const redirectUrl = res.locals.returnTo || "/listings";
  req.flash("success", "Welcome back!");
  res.redirect(redirectUrl);
};

module.exports.Logout= async(req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};