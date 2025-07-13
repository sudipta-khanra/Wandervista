const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { listings: allListings }); // ✅ send correctly
// };

// module.exports.index = async (req, res) => {
//   const listings = await Listing.find({});
//   res.render("listings/index", {
//     listings,
//     city: "",
//     tag: "",
//     isSearchPage: false  // ✅ Add this line
//   });
// };
module.exports.index = async (req, res) => {
  let listings = await Listing.find({}); // Use `let` so we can reassign

  if (req.user) {
    const userId = req.user._id.toString();
    listings = listings.map((listing) => {
      const savedByList = Array.isArray(listing.savedBy)
        ? listing.savedBy.map((id) => id.toString())
        : [];
      return {
        ...(listing._doc || listing),
        isSaved: savedByList.includes(userId),
      };
    });
  }

  res.render("listings/index", {
    listings, // pass modified `listings` with isSaved
    city: "",
    tag: "",
    isSearchPage: false,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect(`/listings`);
  }
  // Fetch all listings if needed (for example, for map or sidebar)
  const listings = await Listing.find({});
  // Calculate average rating from reviews
  const reviews = listing.reviews;
  let averageRating = 0;
  if (reviews.length > 0) {
    averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }
  res.render("listings/show.ejs", { listing, listings, averageRating });
};
const fetch = require("node-fetch"); // or axios
module.exports.createListing = async (req, res, next) => {
  try {
    const address = req.body.listing.location;
    const key = process.env.MAP_API;
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(
        address
      )}.json?key=${key}`
    );
    const data = await response.json();
    if (!data.features.length) {
      req.flash("error", "Invalid location");
      return res.redirect("back");
    }
    const [lng, lat] = data.features[0].geometry.coordinates;
    // Create new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.lat = lat;
    newListing.lng = lng;
    // ✅ Extract values from root-level form fields
    newListing.tags = req.body.tags || [];
    newListing.amenities = req.body.amenities || [];
    // ✅ Set GeoJSON geometry field
    newListing.geometry = {
      type: "Point",
      coordinates: [lng, lat], // [longitude, latitude]
    };
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }
    console.log(req.body);
    await newListing.save();
    console.log(`Listing created at latitude: ${lat}, longitude: ${lng}`);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    if (
      err.name === "ValidationError" &&
      (err.errors.propertyType || err.errors.placeType)
    ) {
      req.flash("error", "You need to add more information!");
      return res.redirect("back"); // Redirect back to form
    }
    next(err);
  }
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect(`/listings`);
  }
  let originalImgUrl = listing.image.url;
  console.log(originalImgUrl);
  originalImgUrl = originalImgUrl.replace(
    "/upload/",
    "/upload/h_300,w_400,q_25,c_fill/"
  );
  res.render("listings/edit.ejs", { listing, originalImgUrl });
};
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing not found!");
//     return res.redirect("/listings");
//   }
//   const {
//     title,
//     description,
//     price,
//     location,
//     country,
//     propertyType,
//     placeType,
//   } = req.body.listing;
//   listing.title = title;
//   listing.description = description;
//   listing.price = price;
//   listing.location = location;
//   listing.country = country;
//   listing.propertyType = propertyType;
//   listing.placeType = placeType;
//   listing.tags = Array.isArray(req.body.listing.tags)
//     ? [...new Set(req.body.listing.tags)]
//     : req.body.listing.tags
//     ? [req.body.listing.tags]
//     : [];
//   listing.amenities = Array.isArray(req.body.listing.amenities)
//     ? [...new Set(req.body.listing.amenities)]
//     : req.body.listing.amenities
//     ? [req.body.listing.amenities]
//     : [];
//   listing.topPicks = Array.isArray(req.body.listing.topPicks)
//     ? [...new Set(req.body.listing.topPicks)]
//     : req.body.listing.topPicks
//     ? [req.body.listing.topPicks]
//     : [];
//   if (req.file) {
//     listing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };
//   }
//   await listing.save();
//   req.flash("success", "Listing Edited!");
//   res.redirect(`/listings/${listing._id}`);
// };
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const {
    title,
    description,
    price,
    location,
    country,
    propertyType,
    placeType,
  } = req.body.listing;

  // 🔍 Use MapTiler Geocoding API
  const geoResponse = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(
      location
    )}.json?key=${process.env.MAP_API}&limit=1`
  );
  const geoData = await geoResponse.json();

  if (!geoData.features || geoData.features.length === 0) {
    req.flash("error", "Invalid location. Could not update coordinates.");
    return res.redirect(`/listings/${id}/edit`);
  }

  // ✅ Update geometry
  listing.geometry = geoData.features[0].geometry;

  // Update rest of the fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;
  listing.propertyType = propertyType;
  listing.placeType = placeType;

  listing.tags = Array.isArray(req.body.listing.tags)
    ? [...new Set(req.body.listing.tags)]
    : req.body.listing.tags
    ? [req.body.listing.tags]
    : [];

  listing.amenities = Array.isArray(req.body.listing.amenities)
    ? [...new Set(req.body.listing.amenities)]
    : req.body.listing.amenities
    ? [req.body.listing.amenities]
    : [];

  listing.topPicks = Array.isArray(req.body.listing.topPicks)
    ? [...new Set(req.body.listing.topPicks)]
    : req.body.listing.topPicks
    ? [req.body.listing.topPicks]
    : [];

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Edited!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
