/* Import Modules */
const express = require('express');
const reviewController = require('../controllers/reviewController');
/* Set up the router */
const router = express.Router();

router.post('/reviews', reviewController.createOneReview);

/* API Route: /reviews/:appId */
router
  .route('/reviews/:searchParam')
  .get(reviewController.getAllReviews)
  .delete(reviewController.deleteAllReviews);

/* API Route: /reviews/:appId/:reviewId */
router
  .route('/reviews/:searchParam/:reviewId')
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
