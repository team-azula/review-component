const mongoose = require('mongoose');
const db = require('./index.js');

const reviewSchema = new mongoose.Schema({
  author: String,
  body: String,
  item: Number,
  rating: Number,
  likes: Number
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;