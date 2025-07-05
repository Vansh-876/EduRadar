const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/eduradar";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


// Set EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// Middleware to set default locals
app.use((req, res, next) => {
  res.locals.activePage = null; // default value to avoid undefined errors
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("hi ,im root");
});

// Index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New listing form route
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

// Create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing); // 👈 req.body.listing expected from form
  await newListing.save();
  console.log("New Listing Saved:", newListing);
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
//active page
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

app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing, activePage: null }); // or use "details"
});


// Start server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
