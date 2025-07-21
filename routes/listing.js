if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //photo saving place
router.get("/search", async (req, res) => {
  try {
    const rawInput = req.query.city?.trim();
    const { rating, amenities, propertyTypes, placeTypes, minPrice, maxPrice } =
      req.query;
    const filter = {};
    // Build location filter
    if (rawInput) {
      const parts = rawInput
        .replace(/^[\s,._-]+|[\s,._-]+$/g, "")
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (parts.length === 3) {
        const location = `${parts[0]}, ${parts[1]}`;
        const country = parts[2];
        filter.location = new RegExp(escapeRegex(location), "i");
        filter.country = new RegExp(escapeRegex(country), "i");
      } else if (parts.length === 2) {
        filter.location = new RegExp(escapeRegex(parts[0]), "i");
        filter.country = new RegExp(escapeRegex(parts[1]), "i");
      } else if (parts.length === 1) {
        const input = parts[0];
        const isCountry = await Listing.exists({
          country: new RegExp(`^${escapeRegex(input)}$`, "i"),
        });
        if (isCountry) {
          filter.country = new RegExp(escapeRegex(input), "i");
        } else {
          filter.location = new RegExp(escapeRegex(input), "i");
        }
      }
    }
    // Add filters from query parameters
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }
    if (minPrice && maxPrice) {
      filter.price = {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      };
    }
    if (propertyTypes) {
      const types = propertyTypes.split(",");
      filter.propertyType = { $in: types };
    }
    if (placeTypes) {
      const types = placeTypes.split(",");
      filter.placeType = { $in: types };
    }
    if (amenities) {
      const list = amenities.split(",");
      filter.amenities = { $all: list };
    }

    const listings = await Listing.find(filter);

    const userId = req.user?._id?.toString();
    const enrichedListings = listings.map((listing) => {
      const savedByList = Array.isArray(listing.savedBy)
        ? listing.savedBy.map((id) => id.toString())
        : [];
      return {
        ...(listing._doc || listing),
        isSaved: userId && savedByList.includes(userId),
      };
    });

    res.render("listings/index", {
      listings: enrichedListings,
      city: rawInput || "",
      tag: "",
      isSearchPage: true,
      currUser: req.user,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Internal Server Error");
  }
});
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//index, create listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id([0-9a-fA-F]{24})")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    (req, res, next) => {
      const listing = req.body.listing;
      if (listing) {
        const fieldsToNormalize = ["topPicks", "tags", "amenities"];
        for (const field of fieldsToNormalize) {
          if (listing[field] && !Array.isArray(listing[field])) {
            listing[field] = [listing[field]];
          }
        }
      }
      console.log("Submitted listing data:", req.body.listing);
      next();
    },
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// For update route:
router.put(
  "/:id",
  upload.none(),
  validateListing,
  listingController.updateListing
);
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.get("/listings/filter/:tag", async (req, res) => {
  const { tag } = req.params;
  const userId = req.user?._id?.toString();
  let filter = {};
  if (tag !== "All") {
    filter.tags = tag;
  }

  try {
    const listings = await Listing.find(filter);
    const enrichedListings = listings.map((listing) => {
      const savedByList = Array.isArray(listing.savedBy)
        ? listing.savedBy.map((id) => id.toString())
        : [];

      return {
        ...(listing._doc || listing),
        isSaved: userId && savedByList.includes(userId),
      };
    });

    res.json(enrichedListings);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/listings/:id/save", isLoggedIn, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }
    const isAlreadySaved = listing.savedBy.some(
      (id) => id.toString() === userId.toString()
    );
    let updatedListing;
    if (isAlreadySaved) {
      updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { $pull: { savedBy: userId } },
        { new: true }
      );
    } else {
      updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { $addToSet: { savedBy: userId } },
        { new: true }
      );
    }
    res.json({
      success: true,
      saved: !isAlreadySaved,
      savedBy: updatedListing.savedBy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/listings/favorites", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Listing.find({ savedBy: userId }).populate("owner");

    res.render("listings/favorites", { favorites });
  } catch (err) {
    res.redirect("/");
  }
});

router.delete("/listings/:id/save", isLoggedIn, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;

    await Listing.findByIdAndUpdate(listingId, {
      $pull: { savedBy: userId },
    });

    req.flash("success", "Removed from favorites.");
    res.redirect("/listings/favorites");
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.redirect("/listings/favorites");
  }
});

module.exports = router;
