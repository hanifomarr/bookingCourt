const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Venue = require("./models/venue");
const methodOverride = require("method-override");

mongoose.connect("mongodb://127.0.0.1:27017/vortax");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();
app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/venue", async (req, res) => {
  const venues = await Venue.find({});
  res.render("venues/index", { venues });
});

app.get("/venue/new", (req, res) => {
  res.render("venues/new");
});

app.post("/venue", async (req, res) => {
  const newVenue = new Venue(req.body.venue);
  await newVenue.save();
  res.redirect(`/venue/${newVenue._id}`);
});

app.get("/venue/:id", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  res.render("venues/show", { venue });
});

app.get("/venue/:id/edit", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  res.render("venues/edit", { venue });
});

app.put("/venue/:id", async (req, res) => {
  const { id } = req.params;
  const updateVenue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
  res.redirect(`/venue/${updateVenue._id}`);
});

app.delete("/venue/:id", async (req, res) => {
  const { id } = req.params;
  await Venue.findByIdAndDelete(id);
  res.redirect("/venue");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
