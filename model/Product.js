const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  sex: String,
  img: String,
});

module.exports = mongoose.model("Product", ProductSchema);
