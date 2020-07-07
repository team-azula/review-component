const db = require("./index.js");
const Review = require("./Review.js");

const seedData = require("./data.json");

const seedDatabase = function () {
  Review.create(seedData).then(() => {
    return db.disconnect();
  });
};

seedDatabase();
