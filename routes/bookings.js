const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware");

// POST: Create a booking
router.post("/:listingId/book", isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  try {
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // milliseconds

    const checkInIST = new Date(new Date(checkIn).getTime() + istOffset);
    const checkOutIST = new Date(new Date(checkOut).getTime() + istOffset);

    const newBooking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn: checkInIST,
      checkOut: checkOutIST,
      guests: parseInt(guests),
    });

    await newBooking.save();
    console.log("--------------------------------------");
    req.flash("success", "Your order booked!");
    res.redirect(`/listings/${listingId}?booking=success`);
  } catch (err) {
    res.redirect(`/listings/${listingId}?booking=error`);
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "listing",
        populate: { path: "owner" },
      })
      .populate("user");

    const bookingsWithFormattedDates = bookings.map((b) => {
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return {
        ...b.toObject(),
        checkInFormatted: b.checkIn.toLocaleDateString("en-IN", options),
        checkOutFormatted: b.checkOut.toLocaleDateString("en-IN", options),
      };
    });

    // Get previous page URL from header
    const fromListing = req.get("referer");

    res.render("listings/bookings", {
      bookings: bookingsWithFormattedDates,
      fromListing,
    });
  } catch (err) {
    res.redirect("/");
  }
});

router.delete("/:bookingId", isLoggedIn, async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(403).send("Unauthorized or booking not found");
    }
    console.log("--------------------------------------");
    req.flash("success", "Your order was deleted!");

    res.redirect("/bookings");
  } catch (err) {
    res.redirect("/bookings");
  }
});

module.exports = router;
