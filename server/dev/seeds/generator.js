const faker = require('faker');
const random = require('random');
const createReview = require('../../models/reviewModel');

/* Global variable to hold the number of creations currently made
 * This is used in the database seeding script to keep track of id's during bulk inserts */
let creations = 0;

/**
 * Generate Review
 * @returns {{item: number, author: string, rating: number, body: string, likes: number}}
 * @param itemNumber {number}
 */
const generateReview = (itemNumber = ++creations) =>
  createReview(
    itemNumber,
    faker.internet.userName(),
    faker.lorem.paragraph(),
    random.int(0, 5),
    random.int(0, 5000)
  );

module.exports = generateReview;
