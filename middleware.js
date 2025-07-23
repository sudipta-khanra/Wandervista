const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.use); //to check if user logged in or not
  // console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
      console.log("--------------------------------------");
      console.log("--------------------------------------");
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  next(); // <-- Don't forget this
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next(); // <-- Don't forget this
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
          console.log("--------------------------------------");
          console.log("--------------------------------------");
    req.flash("error", "You are not the owner of the listing!");
    return res.redirect(`/listings/${id}`);
  }
  next(); // <-- Don't forget this
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // if (!review.author.equals(res.locals.currUser._id)) {
  //   req.flash("error", "You are not the author of the review!");
  //   return res.redirect(`/listings/${id}`);
  // }
  if (!review.author.equals(res.locals.currUser._id)) {
  console.log("Not review author – error, You are not the author of the review!");
  console.log("--------------------------------------");
  req.flash("error", "You are not the author of the review!");
  return res.redirect(`/listings/${id}`);
}

  next(); // <-- Don't forget this
};

// middleware
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg); 
  } else {
    next(); // <-- Don't forget this
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg); 
  } else {
    next();
  }
};
