/* Import Modules */
const { getAll, getOne, createOne, updateOne, deleteOne, deleteAll } =
  process.env.CORE_DB === 'PSQL'
    ? require('../database/PostgreSQL/queryFactory')
    : require('../database/Cassandra/queryFactory');

const catchAsync = require('../utils/catchAsync');

/**
 * Get All Reviews
 * @type {function(req, res, next)}
 */
module.exports.getAllReviews = catchAsync(async (req, res) => {
  const { searchParam } = req.params;
  const reviews = await getAll(searchParam, null);
  res.status(200).json(reviews);
});

/**
 * Get All Reviews
 * @type {function(req, res, next)}
 */
module.exports.deleteAllReviews = catchAsync(async (req, res) => {
  const { searchParam } = req.params;
  await deleteAll(searchParam, null);
  res.status(200).json({ message: 'Reviews Deleted!' });
});

/**
 * Create New Review
 * @type {function(req, res, next)}
 */
module.exports.createOneReview = catchAsync(async (req, res) => {
  const newReview = await createOne(req.body);
  res.status(200).json(newReview);
});
/**
 * Get One Review
 * @type {function(req, res, next)}
 */
module.exports.getOneReview = catchAsync(async (req, res) => {
  const { searchParam, reviewId } = req.params;
  const review = await getOne(searchParam, reviewId);
  res.status(200).json(review);
});

/**
 * Update One Review
 * @type {function(req, res, next)}
 */
module.exports.updateOneReview = catchAsync(async (req, res) => {
  const { searchParam, reviewId } = req.params;
  const review = await updateOne(searchParam, reviewId);
  res.status(200).json(review);
});

/**
 * Delete One Review
 * @type {function(req, res, next)}
 */
module.exports.deleteOneReview = catchAsync(async (req, res) => {
  const { searchParam, reviewId } = req.params;
  await deleteOne(searchParam, reviewId);
  res.status(200).json({ message: 'Review Deleted!' });
});

/**
 * Get All Likes
 * @type {function(req, res, next)}
 */
module.exports.getAllLikes = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const likes = await getAll(null, reviewId);
  res.status(200).json(likes);
});

/**
 * Create One Like
 * @type {function(req, res, next)}
 */
module.exports.createOneLike = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const likes = await updateOne(null, reviewId);
  res.status(200).json(likes);
});

/**
 * Delete One Like
 * @type {function(req, res, next)}
 */
module.exports.deleteOneLike = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const likes = await deleteOne(null, reviewId);
  res.status(200).json(likes);
});
