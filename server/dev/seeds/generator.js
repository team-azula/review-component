/* eslint-disable no-unused-vars */
const faker = require('faker');
const random = require('random');
const { createReview } = require('../../models/reviewModel');
const short = require('short-uuid');

/* Global variable to hold the number of creations currently made
 * This is used in the database seeding script to keep track of id's during bulk inserts */
let creations = 1;
/**
 * Generate Review
 * @returns {{query: any, params: (number | string)[]} | {item: number, author: string, rating: number, body: string, likes: number}}
 * @param shouldIterateCreations {boolean} - Should iterate the creations variable on function call
 * @param queryString {string} - The query string to use for insertion
 */
const generateReview = (shouldIterateCreations, queryString) => {
  if (shouldIterateCreations) {
    creations += 1;
  }

  if (queryString) {
    return {
      query: queryString,
      params: [
        short.generate(),
        faker.internet.userName(),
        faker.lorem.paragraph(),
        creations,
        random.int(0, 5),
        random.int(0, 500),
      ],
    };
  }

  return createReview(
    creations,
    faker.internet.userName(),
    faker.lorem.paragraph(),
    random.int(0, 5),
    random.int(0, 500)
  );
};

module.exports = generateReview;
