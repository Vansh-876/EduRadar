const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isListingOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// ✅ Route for listing index + create listing
router.route("/listings")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// ✅ New Listing Form
router.get("/listings/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// ✅ Show, Update, Delete for individual listings
router.route("/listings/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isListingOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isListingOwner, wrapAsync(listingController.deleteListing));

// ✅ Edit Form
router.get("/listings/:id/edit", isLoggedIn, isListingOwner, wrapAsync(listingController.renderEditForm));

// ✅ Explore Route
router.get("/explore", wrapAsync(listingController.explore));

module.exports = router;
