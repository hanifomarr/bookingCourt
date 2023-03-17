const mongoose = require("mongoose");
const Venue = require("../models/venue");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
mongoose.connect("mongodb://127.0.0.1:27017/vortax");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Venue.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const newVenue = new Venue({
      name: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
    });
    await newVenue.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
