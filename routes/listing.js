const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");4
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let {error} =  listingSchema.validate(req.body);
if (error) {
  let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }else { 
next();
} 
};

// index Routes
router.get("/", wrapAsync(async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings, activePage: "listings" });
}));

// New Listing Routes
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Create Listing Routes
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
    await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
}));


// Show Listing Routes
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

// Edit Listing Routes 
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
    if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  req.flash("success", "Editing listing...");
  res.render("listings/edit", { listing }); 
}));

// Update Listing Routes
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));

// Delete Listing Routes
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;