const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    default: "No description provided"
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  distance: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  openHours: {
    type: String,
    default: "9 AM - 5 PM"
  },
  contact: {
    type: String,
    default: "Not Provided"
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1742853288141-b95880a1c5ea?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
