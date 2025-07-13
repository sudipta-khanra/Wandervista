// routes/oauth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// LinkedIn
// router.get('/auth/linkedin', passport.authenticate('linkedin'));

// router.get('/auth/linkedin/callback',
//   passport.authenticate('linkedin', {
//     failureRedirect: '/login',
//     failureFlash: true,
//   }),
//   (req, res) => {
//     req.flash('success', 'Welcome back!');
//     res.redirect('/listings');
//   }
// );

// GitHub
router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/listings');
  }
);

module.exports = router;
