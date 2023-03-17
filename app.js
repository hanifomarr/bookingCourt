const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Venue = require("./models/venue");

mongoose.connect("mongodb://127.0.0.1:27017/vortax");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/venue", async (req, res) => {
  const venues = await Venue.find({});
  res.render("venues/index", { venues });
});

app.get("/venue/:id", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  res.render("venues/show", { venue });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
