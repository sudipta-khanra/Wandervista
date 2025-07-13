const mongoose = require("mongoose");
const Review = require("./review");
const { ref, required } = require("joi");
const Schema = mongoose.Schema;
const fetch = require("node-fetch");
const Booking = require("./booking"); // ✅ import your Booking model

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
    },
  },
  price: Number,

  // location: String,

  // location: {
  //   type: String,
  //     required: [true, "Location is required"],
  // trim: true,
  //   validate: {
  //     validator: function (v) {
  //       return typeof v === "string" && isNaN(v); // Reject numbers
  //     },
  //     message: (props) => `${props.value} is not a valid location name!`,
  //   },
  // },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9\s,'-]{3,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid location!`,
    },
  },

  // country: String,

  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9\s,'-]{3,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid country!`,
    },
  },

  //country & location were written like this to prevent to writing number as a string,  Mongoose allows number in a string field,  to Prevent Non-String Inputs (e.g. numbers)

  // Add geometry field for GeoJSON point here:
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // 'Point' is the only allowed value
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
  },

  propertyType: {
    type: String,
    enum: ["Apartment", "House", "Villa", "Guesthouse", "Hotel"],
    required: true,
  },

  placeType: {
    type: String,
    enum: ["Entire Place", "Private Room", "Shared Room"],
    required: true,
  },

  tags: {
    type: [String], // Array of strings
    enum: [
      "Trending",
      "Beach",
      "Iconic Cities",
      "Mountains",
      "Rooms",
      "Amazing Pools",
      "Camping",
      "Lake Front",
      "Castles",
      "Farms",
      "Tiny House",
      "Cable Car",
      "Hotels",
      "Worship",
      "Domes",
      "Boats",
    ],
    default: [],
  },

  amenities: {
    type: [String],
    enum: [
      "WiFi",
      "Kitchen",
      "Free Parking",
      "Air Conditioning",
      "Washer",
      "TV",
      "Pool",
      "Heating",
      "Workspace",
      "Pet-Friendly",
    ],
    default: [],
  },
  topPicks: {
    type: [String],
    enum: [
      "Instant Book",
      "Free Cancellation",
      "Pets Allowed",
      "Eco-friendly Stay",
    ],
    default: [],
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    await Booking.deleteMany({ listing: listing._id });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
