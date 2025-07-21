const express = require("express");
const app = express();

const router = express.Router()




router.get("/", (req, res) => {
  res.send("welcome to users");
});

router.get("/:id", (req, res) => {
  res.send("welcome to id");
});

router.delete("/:id", (req, res) => {
  res.send("welcome to delete id");
});

module.exports = router