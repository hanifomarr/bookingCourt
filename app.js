const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Venue = require("./models/venue");
const methodOverride = require("method-override");
const AppError = require("./utils/AppError");
const CatchAsync = require("./utils/CatchAsync");

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

app.get(
  "/venue",
  CatchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render("venues/index", { venues });
  })
);

app.get("/venue/new", (req, res) => {
  res.render("venues/new");
});

app.post(
  "/venue",
  CatchAsync(async (req, res, next) => {
    if (!req.body.venue) {
      throw new AppError("Invalid Data", 400);
    }
    const newVenue = new Venue(req.body.venue);
    await newVenue.save();
    res.redirect(`/venue/${newVenue._id}`);
  })
);

app.get(
  "/venue/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    res.render("venues/show", { venue });
  })
);

app.get(
  "/venue/:id/edit",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    res.render("venues/edit", { venue });
  })
);

app.put(
  "/venue/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updateVenue = await Venue.findByIdAndUpdate(id, {
      ...req.body.venue,
    });
    res.redirect(`/venue/${updateVenue._id}`);
  })
);

app.delete(
  "/venue/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    res.redirect("/venue");
  })
);

app.all("*", (req, res, next) => {
  next(new AppError("Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Something Wrong";
  }
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
