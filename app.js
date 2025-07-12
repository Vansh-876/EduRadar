const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const sampleListings = require("./init/data.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const UserRoutes = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/eduradar";

// Set EJS view engine and middleware
app.set("view engine", "ejs");
app.set("views", (path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.locals.activePage = null;
  next();
});


async function seedDB() {
  try {
    await Listing.deleteMany({});
    console.log("Old listings deleted 🗑️");
    await Listing.insertMany(sampleListings);
    console.log("Seeding completed ✅");
  } catch (err) {
    console.error("Seeding failed ❌", err);
  }
}

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db ✅");

    // Seed the database
    await seedDB();

    // Start server only after DB is connected and seeded
    app.listen(8080, () => {
      console.log("server is listening to port 8080 🚀");
    });

  } catch (err) {
    console.log("Error in DB connection ❌", err);
  }
}

main();

// Session configuration
const sessionConfig = {
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true
  }
};


// Session and Flash
app.use(session(sessionConfig));
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals middleware (must come after passport)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


// ✅ THEN define your routes
app.get("/", (req, res) => {
  res.render("home", { activePage: "home" });
});

app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", UserRoutes);


// 404 Error Handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});
