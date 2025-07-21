if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { default: mongoose } = require("mongoose");
const Listing = require("./models/listing");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const listingRoutes = require("./routes/listing.js");
const citiesByCountry = require("./data/country");
const citiesByDestinations = require("./data/destinations.js");
const bookingRoutes = require("./routes/bookings.js");
const GitHubStrategy = require("passport-github2").Strategy;
const oauthRoutes = require('./routes/oauth.js');
const footerRoutes = require('./routes/footer');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
//database connection
const MONGOATLAS_URL = process.env.MONGODB_ATLAS;

//if there is no update the server then the session will automatically update after 24 hours
const store = MongoStore.create({
  mongoUrl: MONGOATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error", err);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_ATLAS);
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LinkedIn strategy
// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_CLIENT_ID,
//   clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//   callbackURL: "/auth/linkedin/callback",
//   scope: ['r_liteprofile', 'r_emailaddress'],
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ linkedinId: profile.id });
//     if (!user) {
//       user = await User.create({
//         username: profile.displayName,
//         email: profile.emails?.[0].value || "",
//         linkedinId: profile.id,
//       });
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

// GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({
        username: profile.displayName || profile.username,
        email: profile.emails?.[0].value || "",
        githubId: profile.id,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

//flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});


app.use((req, res, next) => {
  const { listing } = req.body;

  if (listing) {
    const fieldsToNormalize = ["topPicks", "tags", "amenities"];

    for (const field of fieldsToNormalize) {
      if (listing[field] && !Array.isArray(listing[field])) {
        listing[field] = [listing[field]];
      }
    }
  }
  next();
});

//citiesByCountry middleware
app.use((req, res, next) => {
  res.locals.citiesByCountry = JSON.stringify(citiesByCountry);
  res.locals.citiesByDestinations = JSON.stringify(citiesByDestinations);

  next();
});

app.use("/bookings", bookingRoutes);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", listingRoutes);
app.use("/", oauthRoutes);
app.use('/', footerRoutes);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//app listener
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});


function applyModalFilters(filters) {
  const filteredListings = allListings.filter((listing) => {
    return (
      (!filters.propertyType ||
        filters.propertyType.includes(listing.propertyType)) &&
      (!filters.amenities ||
        filters.amenities.every((a) => listing.amenities.includes(a))) &&
      (!filters.minPrice || listing.price >= filters.minPrice) &&
      (!filters.maxPrice || listing.price <= filters.maxPrice)
    );
  });

  renderListings(filteredListings);
}
