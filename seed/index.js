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
    const price = Math.floor(Math.random() * 35) + 10;
    const newVenue = new Venue({
      name: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
      img: "https://placeimg.com/640/480/any",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, eligendi!",
      price: price,
    });
    await newVenue.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
