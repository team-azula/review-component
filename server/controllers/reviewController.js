/* Import Modules */
const catchAsync = require('../utils/catchAsync');

/**
 * Get All Reviews
 * @type {function(req, res, next)}
 */
module.exports.getAllReviews = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'getAllReviews works!' });
});

/**
 * Create New Review
 * @type {function(req, res, next)}
 */

module.exports.createNewReview = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'createNewReview works!' });
});
/**
 * Get One Review
 * @type {function(req, res, next)}
 */
module.exports.getOneReview = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'getOneReview works!' });
});

/**
 * Update One Review
 * @type {function(req, res, next)}
 */
module.exports.updateOneReview = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'updateOneReview works!' });
});

/**
 * Delete One Review
 * @type {function(req, res, next)}
 */
module.exports.deleteOneReview = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'deleteOneReview works!' });
});

/**
 * Get All Likes
 * @type {function(req, res, next)}
 */
module.exports.getAllLikes = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'getAllLikes works!' });
});

/**
 * Create One Like
 * @type {function(req, res, next)}
 */
module.exports.createOneLike = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'createOneLike works!' });
});

/**
 * Delete One Like
 * @type {function(req, res, next)}
 */
module.exports.deleteOneLike = catchAsync(async (req, res) => {
  // TODO
  res.status(200).json({ message: 'deleteOneLike works!' });
});
