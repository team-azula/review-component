/* Import Modules */
const express = require('express');
const reviewController = require('../controllers/reviewController');

/* Set up the router */
const router = express.Router();

/* API Route: /reviews */
router
  .route('/reviews')
  .get(reviewController.getAllReviews)
  .post(reviewController.createNewReview);

/* API Route: /reviews/:appId */
router
  .route('/reviews/:appId')
  .get(reviewController.getOneReview)
  .put(reviewController.updateOneReview)
  .patch(reviewController.updateOneReview)
  .delete(reviewController.deleteOneReview);

/* API Route: /likes/:reviewId */
router
  .route('/likes/:reviewId')
  .get(reviewController.getAllLikes)
  .post(reviewController.createOneLike)
  .delete(reviewController.deleteOneLike);

/* Export the router */
module.exports = router;
