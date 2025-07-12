const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");4
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,  isListingOwner} = require("../middleware.js");

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
  newListing.owner =req.user._id;
    await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect(`/listings/${newListing._id}`);
}));


// Show Listing Routes
router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
});

// Edit route
router.get("/:id/edit", isLoggedIn, isListingOwner, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
});

// Update route
router.put("/:id", isLoggedIn, isListingOwner, async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
});

// Delete route
router.delete("/:id", isLoggedIn, isListingOwner, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
});



module.exports = router;