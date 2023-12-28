const express = require("express");
const path = require("path");
const db = require("./database/connect");
const app = express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000;

// setting static content directory
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// to parse url encoded bodies
app.use(express.urlencoded({ extended: true }));

// parse json bodies
app.use(express.json());

// setting view engine to ejs
app.set("view engine", "ejs");

// app uses cookies
app.use(cookie());

// checking database connection
db.connect((error) => {
  if (error) {
    console.log("could not connect");
  } else {
    console.log("connected");
  }
});

// setting page navigation routes
const pages = require("./routes/pages");
app.use("/", pages.router);

// auth routes
app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log("server start at " + PORT);
});
