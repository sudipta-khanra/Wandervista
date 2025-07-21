const express = require("express");
const app = express();
const port = 3000;
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mynamesudipta",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use("/users", users);
app.use("/posts", posts);

app.get("/test", (req, res) => {
  res.send("successful");
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  console.log(req.session.name);
  req.flash("success", "user register successfully");
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("./page.ejs", {
    name: req.session.name,
    msg: req.flash("success"),
  });
});

app.listen(port, (req, res) => {
  console.log("app is listening on port 3000");
});
