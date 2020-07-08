/* Import Modules */
const express = require('express');
const reviewController = require('../controllers/reviewController');

/* Set up the router */
const router = express.Router();

router.post('/reviews', reviewController.createOneReview);

/* API Route: /reviews/:appId */
router
  .route('/reviews/:appId')
  .get(reviewController.getAllReviews)
  .delete(reviewController.deleteAllReviews);

/* API Route: /reviews/:username */
router
  .route('/reviews/:username')
  .get(reviewController.getAllReviews)
  .delete(reviewController.deleteAllReviews);

/* API Route: /reviews/:appId/:reviewId */
router
  .route('/reviews/:appId/:reviewId')
  .get(reviewController.getOneReview)
  .put(reviewController.updateOneReview)
  .patch(reviewController.updateOneReview)
  .delete(reviewController.deleteOneReview);

/* API Route: /reviews/:username/:reviewId */
router
  .route('/reviews/:username/:reviewId')
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
