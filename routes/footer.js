const express = require('express');
const router = express.Router();

// Privacy Policy page
router.get('/privacy-policy', (req, res) => {
  res.render('listings/privacy-policy');
});

// Terms of Service page
router.get('/terms-of-service', (req, res) => {
  res.render('listings/terms-of-service');
});

module.exports = router;
