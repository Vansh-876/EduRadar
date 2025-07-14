const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");4
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,  isListingOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const {storage} =require ("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync (listingController.createListing)
    ),

// New Listing Routes
router.get("/new", isLoggedIn,wrapAsync( listingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn, isListingOwner, wrapAsync (listingController.updateListing))
.delete( isLoggedIn, isListingOwner, wrapAsync(listingController.deleteListing) );


// Edit route
router.get("/:id/edit", isLoggedIn, isListingOwner, wrapAsync( listingController.renderEditForm));


module.exports = router;