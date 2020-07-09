/* eslint-disable no-console,no-plusplus,no-unused-expressions */
/* Import Modules */
const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');
const { Spinner } = require('cli-spinner');
/* Import PG Promise for use in massive data insertion */
const pgp = require('pg-promise')({
  capSQL: true, // generate capitalized SQL
});

const getNextData = require('./getNextData');

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
      id SERIAL UNIQUE,
      author VARCHAR,
      body VARCHAR,
      item INT,
      rating INT,
      likes INT
      );`);

  return db;
};

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
      getNextData(t, index, chunkSize, chunks, null).then(processData)
    );
  })
    .then((data) => {
      // Notify the user of total batches and insertion time
      console.log(
        `\nTotal batches: ${data.total}, Duration: ${data.duration} ms`
      );
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(async () => {
      const start = new Date().getTime();
      const spinner = new Spinner('Indexing item column... %s  ');
      spinner.setSpinnerString('|/-\\');
      spinner.start();

      await db.none('CREATE INDEX idx_app_id ON reviews(item)');

      spinner.setSpinnerTitle('Indexing author column... %s  ');
      await db.none('CREATE INDEX idx_author_id ON reviews(author)');

      spinner.setSpinnerTitle('Indexing review column... %s  ');
      await db.none('CREATE INDEX idx_item_id ON reviews(id)');

      spinner.stop();

      const end = new Date().getTime();
      const time = end - start;

      // Complete! - End the connection
      console.log(`\nTotal time to index: ${time} ms`);
      console.log('Closing connection... ');
      db.$pool.end();
    });
};

module.exports = seedPostgres;
