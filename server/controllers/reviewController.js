/* Import Modules */
const { getAll, getOne, updateOne, deleteOne, deleteAll } =
  process.env.CORE_DB === 'PSQL'
    ? require('../database/PostgreSQL/queryFactory')
    : require('../database/Cassandra/queryFactory');

const catchAsync = require('../utils/catchAsync');

/**
 * Get All Reviews
 * @type {function(req, res, next)}
 */
module.exports.getAllReviews = catchAsync(async (req, res) => {
  // TODO HANDLES APPID & USERNAME
  const reviews = await getAll();
  res.status(200).json(reviews);
});

/**
 * Get All Reviews
 * @type {function(req, res, next)}
 */
module.exports.deleteAllReviews = catchAsync(async (req, res) => {
  // TODO HANDLES APPID & USERNAME
  await deleteAll();
  res.status(200).json({ message: 'Reviews Deleted!' });
});

/**
 * Create New Review
 * @type {function(req, res, next)}
 */

module.exports.createOneReview = catchAsync(async (req, res) => {
  // TODO HANDLES APPID ONLY
  res.status(200).json({ message: 'createOneReview works!' });
});
/**
 * Get One Review
 * @type {function(req, res, next)}
 */
module.exports.getOneReview = catchAsync(async (req, res) => {
  // TODO HANDLES APPID & USERNAME
  res.status(200).json({ message: 'getOneReview works!' });
});

/**
 * Update One Review
 * @type {function(req, res, next)}
 */
module.exports.updateOneReview = catchAsync(async (req, res) => {
  // TODO HANDLES APPID & USERNAME
  res.status(200).json({ message: 'updateOneReview works!' });
});

/**
 * Delete One Review
 * @type {function(req, res, next)}
 */
module.exports.deleteOneReview = catchAsync(async (req, res) => {
  // TODO HANDLES APPID & USERNAME
  res.status(200).json({ message: 'deleteOneReview works!' });
});

/**
 * Get All Likes
 * @type {function(req, res, next)}
 */
module.exports.getAllLikes = catchAsync(async (req, res) => {
  // TODO HANDLES REVIEWID
  res.status(200).json({ message: 'getAllLikes works!' });
});

/**
 * Create One Like
 * @type {function(req, res, next)}
 */
module.exports.createOneLike = catchAsync(async (req, res) => {
  // TODO HANDLES REVIEWID
  res.status(200).json({ message: 'createOneLike works!' });
});

/**
 * Delete One Like
 * @type {function(req, res, next)}
 */
module.exports.deleteOneLike = catchAsync(async (req, res) => {
  // TODO HANDLES REVIEWID
  res.status(200).json({ message: 'deleteOneLike works!' });
});
