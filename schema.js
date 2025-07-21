const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),

    image: Joi.object({
      url: Joi.string().uri().allow("", null).optional(),
    }).optional(),

    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),

    propertyType: Joi.string()
      .valid("Apartment", "House", "Villa", "Guesthouse", "Hotel")
      .required(),
    placeType: Joi.string()
      .valid("Entire Place", "Private Room", "Shared Room")
      .required(),

    tags: Joi.array()
      .items(
        Joi.string().valid(
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
          "Boats"
        )
      )
      .optional(),

    amenities: Joi.array()
      .items(
        Joi.string().valid(
          "WiFi",
          "Kitchen",
          "Free Parking",
          "Air Conditioning",
          "Washer",
          "TV",
          "Pool",
          "Heating",
          "Workspace",
          "Pet-Friendly"
        )
      )
      .optional(),

    topPicks: Joi.array()
      .items(
        Joi.string().valid(
          "Instant Book",
          "Free Cancellation",
          "Pets Allowed",
          "Eco-friendly Stay"
        )
      )
      .optional(),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }),
});
