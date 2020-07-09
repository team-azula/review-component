const random = require('random');
const generateReview = require('./generator');

/**
 * Get Next Data
 * @param t - The current database transaction
 * @param currentChunk {number} - The current page of data being processed
 * @param chunkSize {number} - The total chunkSize of each chunk
 * @param chunks {number} - The total number of chunks to be processed
 * @returns {Promise<unknown>} - Array of data to be inserted into the database
 * @param queryString {string} - The string to use for query insertion
 */
function getNextData(t, currentChunk, chunkSize, chunks, queryString) {
  return new Promise((resolve) => {
    /* If the current chunk number is greater than (or equal to) the total number of chunks, resolve to null to stop
     seeding */
    if (currentChunk >= chunks) {
      resolve(null);
    }

    /* Create an array to hold the new generated data
     Save out array data one chunk at a time so
     massive arrays do not overflow the memory */
    const reviews = [];

    // Generate data for each chunk and push it to the array
    for (let i = 1; i <= chunkSize; i++) {
      // Get max number of reviews for the app
      const numberOfReviews = random.int(2, 8);

      for (let j = 1; j <= numberOfReviews; j++) {
        j === numberOfReviews
          ? reviews.push(generateReview(true, queryString))
          : reviews.push(generateReview(false, queryString));
      }
    }
    // Resolve this promise with the generated data
    resolve(reviews);
  });
}

module.exports = getNextData;
