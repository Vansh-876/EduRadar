const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  category:String,
  location: String,
  openHours: String,
  contact: String ,
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1742853288141-b95880a1c5ea?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  owner: {
    type: Schema.Types.ObjectId,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
