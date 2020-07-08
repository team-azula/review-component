/* eslint-disable no-console */
/* Import Modules */
const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');

/* Import PG Promise for use in massive data insertion */
const pgp = require('pg-promise')({
  capSQL: true, // generate capitalized SQL
});

/* Import the review generator */
const generateReview = require('./generator');

/**
 * Prepare Database
 * @param dbName {string} - The name of the database to prepare for seeding
 * @returns {Promise<any>} - The database connection
 */
const prepareDatabase = async (dbName) => {
  const cn = {
    host: process.env.PGHOST,
    port: `${process.env.PGPORT}`,
    database: 'postgres',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  };

  let db = pgp(cn);

  await db.none('DROP DATABASE IF EXISTS $1:name', [dbName]);
  await db.none('CREATE DATABASE $1:name', [dbName]);
  await pgp.end();

  cn.database = dbName;
  cn.max = 30;

  db = pgp(cn);

  await db.none('DROP TABLE IF EXISTS $1:name', ['reviews']);
  await db.none(`
  CREATE TABLE reviews (
      author varchar,
      body varchar,
      item int,
      rating int,
      likes int
      );`);

  return db;
};

/**
 * Get Next Data
 * @param t - The current database transaction
 * @param currentChunk {number} - The current page of data being processed
 * @param chunkSize {number} - The total chunkSize of each chunk
 * @param chunks {number} - The total number of chunks to be processed
 * @returns {Promise<Array<>>} - Array of data to be inserted into the database
 */
function getNextData(t, currentChunk, chunkSize, chunks) {
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
      reviews.push(generateReview());
    }

    // Resolve this promise with the generated data
    resolve(reviews);
  });
}

/**
 * Seed Postgres
 * @param dbName {string} - The database name
 * @param amount {string} - The amount of items to seed
 * @returns {Promise<void>}
 */
const seedPostgres = async (dbName, amount) => {
  let chunkSize = 10000;
  let chunks = Math.ceil(amount / chunkSize);

  // If the number of desired seed entries is less than the total chunkSize
  // Set the parameters to only insert 1 chunk of n value
  if (amount < chunkSize) {
    chunkSize = amount;
    chunks = 1;
  } else {
    chunks = Math.floor(amount / chunkSize);
  }

  // Prepare the database
  const db = await prepareDatabase(dbName);

  // Configure pg-promise to use the database columns
  const cs = new pgp.helpers.ColumnSet(
    ['author', 'body', 'item', 'rating', 'likes'],
    { table: 'reviews' }
  );

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

  // Start the massive-insert transaction
  db.tx('massive-insert', (t) => {
    const processData = (data) => {
      if (data) {
        const insert = pgp.helpers.insert(data, cs);
        creationBar.tick();
        return t.none(insert);
      }
    };
    return t.sequence((index) =>
      getNextData(t, index, chunkSize, chunks).then(processData)
    );
  })
    .then((data) => {
      // Notify the user of total batches and insertion time
      console.log(
        `\nTotal batches:${data.total}, Duration:${data.duration} ms`
      );
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(async () => {
      // Complete! - End the connection
      await pgp.end();
    });
};

module.exports = seedPostgres;
