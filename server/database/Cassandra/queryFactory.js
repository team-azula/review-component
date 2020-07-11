/* Import Modules */
const { getConnectionClient } = require('./index');

/**
 * Pluck Review Ids
 * @param queryResult
 * @returns {*}
 */
const pluckReviewIds = (queryResult) =>
  queryResult.rows[0]['system.blobastext(reviewids)'].split(',');

/**
 * Get All
 * @param searchParam
 * @param reviewId
 * @returns {Promise<number|NumberConstructor|any[]>}
 */
module.exports.getAll = async (searchParam, reviewId) => {
  if (searchParam && !reviewId) {
    const getReviewIds =
      'SELECT blobAsText(reviewids) FROM reviews_by_item WHERE item= ?';
    const appResult = await getConnectionClient().execute(
      getReviewIds,
      [searchParam],
      {
        prepare: true,
      }
    );

    if (!appResult.rows[0]) {
      return [];
    }

    const reviewIds = pluckReviewIds(appResult);
    const getReviewsById = 'SELECT * FROM review_by_id WHERE reviewid IN ?';
    const reviews = await getConnectionClient().execute(
      getReviewsById,
      [reviewIds],
      {
        prepare: true,
      }
    );
    return reviews.rows;
  }
};
