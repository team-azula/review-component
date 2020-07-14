/* eslint-disable no-unused-vars */
const faker = require('faker');
const random = require('random');
const { createReview } = require('../../../models/reviewModel');

/* Global variable to hold the number of creations currently made
 * This is used in the database seeding script to keep track of id's during bulk inserts */
let creations = 1;

/**
 * Generate Review
 * @returns {{item: number, author: string, rating: number, body: string, likes: number} | any}
 * @param shouldIterateCreations {boolean} - Should iterate the creations variable on function call
 */
const generateReview = (shouldIterateCreations, startAmount) => {
  if (shouldIterateCreations) {
    creations += 1;
  }

  return createReview(
    creations + startAmount,
    faker.internet.userName(),
    faker.lorem.paragraph(),
    random.int(0, 5),
    random.int(0, 500)
  );
};

module.exports = generateReview;
