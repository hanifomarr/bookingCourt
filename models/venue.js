const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: String,
  location: String,
  desc: String,
  price: String,
});

module.exports = mongoose.model("Venue", venueSchema);
