const express = require("express");
const path = require("path");
const db = require("../database/index.js");
const Review = require("../database/Review.js");
const bodyParser = require("body-parser");

const app = express();
const port = 3002;

app.use(express.static(__dirname + "/../client/dist"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/reviews/:appid", (req, res) => {
  const appId = req.params.appid;
  Review.find({ item: appId }, (err, reviews) => {
    if (err) {
      return console.log(err);
    }
    res.json(reviews);
  });
});

app.post("/reviews", (req, res) => {
  const review = req.body;
  Review.create(review, (err, response) => {
    if (err) {
      return console.log(err);
    }
    res.json("sent");
  });
});

app.post("/likes/:reviewId", (req, res) => {
  Review.findById(req.params.reviewId, (err, review) => {
    Review.updateOne(
      { _id: review._id },
      { likes: review.likes + 1 },
      (err, whatever) => {
        res.end();
      }
    );
  });
});

const server = app.listen(port, () =>
  console.log(`Review component running on port ${port}!`)
);

module.exports = server;
