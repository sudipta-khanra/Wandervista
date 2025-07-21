const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("POST /posts is working");
});


router.get("/:id", (req, res) => {
  res.send("POST ID /posts is working");
});

module.exports = router;
