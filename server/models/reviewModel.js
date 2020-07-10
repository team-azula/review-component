const short = require('short-uuid');

/**
 * Review Model
 * @param author {string} - the author of the review
 * @param body {string} - the body text of the review
 * @param item {number} - the item number
 * @param rating {number} - the overall rating given in the review
 * @param likes {number} - the number of likes the review has recieved
 * @returns {{item: number, author: string, rating: number, body: string, likes: number}}
 * @constructor
 */
module.exports.createReview = (item, author, body, rating, likes) => ({
  _id: short.generate(),
  item,
  author,
  body,
  rating,
  likes,
});
