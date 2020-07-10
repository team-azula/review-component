const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');
const cassandra = require('cassandra-driver');

const { executeConcurrent } = cassandra.concurrent;
const database = require('../../../database/Cassandra');

const getNextData = require('../getNextData');

/**
 * Seed Cassandra Database
 * @param amount {number}
 * @param dbName {string}
 */
const seedCassandra = async (dbName, amount) => {
  let chunkSize = 2000;
  let chunks;

  // If the number of desired seed entries is less than the total chunkSize
  // Set the parameters to only insert 1 chunk of n value
  if (amount < chunkSize) {
    chunkSize = amount;
    chunks = 1;
  } else {
    chunks = Math.floor(amount / chunkSize);
  }

  /* Create a progress bar to notify the user of bulk creation progress */
  const creationBar = new ProgressBar(
    chalkPipe('green.bold')(
      'Seeding [:bar] :current of :total chunks - :percent - :etas remaining'
    ),
    {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: chunks,
    }
  );

  let client;
  const concurrencyLevel = 2000;

  /* Queries For Use In Batch Insertion*/
  const insertReviewQuery =
    'INSERT INTO review_by_id (reviewId, author, body, item, rating, likes) VALUES (?, ?, ?, ?, ?, ?)';

  const insertItemQuery =
    'INSERT INTO reviews_by_item (item, reviewIds) VALUES (?, textAsBlob(?))';

  const insertAuthorQuery =
    'INSERT INTO reviews_by_author (author, reviewIds) VALUES (?, textAsBlob(?))';

  try {
    /* Connect to the database */
    client = await database.connectToDatabase();

    /* Truncate existing tables */
    await client.execute('TRUNCATE TABLE reviews_by_item');
    await client.execute('TRUNCATE TABLE reviews_by_author');
    await client.execute('TRUNCATE TABLE review_by_id');

    const processData = async (reviews) => {
      const reviewData = [];
      const itemData = {};
      const authorData = {};

      /* Generate data object to be imported to Cassandra*/
      reviews.forEach((review) => {
        reviewData.push([
          review._id,
          review.author,
          review.body,
          review.item,
          review.rating,
          review.likes,
        ]);

        if (!itemData[review.item]) {
          itemData[review.item] = review._id;
        } else {
          itemData[review.item] += `,${review._id}`;
        }

        if (!authorData[review.author]) {
          authorData[review.author] = review._id;
        } else {
          authorData[review.author] += `,${review._id}`;
        }
      });

      await executeConcurrent(client, insertReviewQuery, reviewData, {
        concurrencyLevel,
      });
      await executeConcurrent(
        client,
        insertItemQuery,
        Object.entries(itemData),
        {
          concurrencyLevel,
        }
      );
      await executeConcurrent(
        client,
        insertAuthorQuery,
        Object.entries(authorData),
        {
          concurrencyLevel,
        }
      );
    };

    /* Start the timer */
    const start = new Date().getTime();

    /* Generate Batches */
    for (let i = 0; i < chunks; i += 1) {
      creationBar.tick();
      await getNextData(null, i, chunkSize, chunks, false).then(processData);
    }
    console.log('Verifying... ');

    /* End the timer - and report the total time taken */
    const end = new Date().getTime();
    const time = end - start;

    console.log(`Total batches: ${chunks}, Duration: ${time} ms`);

    console.log('Closing connection... ');
  } catch (e) {
    console.log(e);
  } finally {
    client.shutdown();
  }
};

module.exports = seedCassandra;
