const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const sampleListings = require("./init/data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/eduradar";

// Set EJS view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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

// Routes
app.get("/", (req, res) => {
  res.render("home", { activePage: "home" });
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings, activePage: "listings" });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new", { activePage: "new" });
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing, activePage: null });
});

app.get("/listings/:id/edit", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
