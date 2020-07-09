const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');
const { Spinner } = require('cli-spinner');
const database = require('../../database/Cassandra');
const getNextData = require('./getNextData');
/**
 * Seed Cassandra Database
 * @param amount {number}
 * @param dbName {string}
 */
const seedCassandra = async (dbName, amount) => {
  let chunkSize = 10;
  let chunks = Math.ceil(amount / chunkSize);

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
  const insertionQuery =
    'INSERT INTO reviews (id, author, body, item, rating, likes) VALUES (?, ?, ?, ?, ?, ?)';

  let client;

  try {
    client = await database.connectToDatabase();
    await client.execute('TRUNCATE TABLE reviews');

    const processData = (queries) => {
      if (queries) {
        creationBar.tick();
        return client.batch(queries, { prepare: true });
      }
    };

    /* Start the timer */
    const start = new Date().getTime();

    /* Awaits are not naturally used in for loops
     *  They are used here to keep batches from overflowing the Cassandra connection
     * */
    for (let i = 0; i < chunks; i += 1) {
      const queries = await getNextData(
        null,
        i,
        chunkSize,
        chunks,
        insertionQuery
      );
      await processData(queries);
    }

    /* End the timer - and report the total time taken */
    const end = new Date().getTime();
    const time = end - start;

    console.log(`\nTotal batches: ${chunks}, Duration: ${time} ms`);

    const indexStart = new Date().getTime();
    const spinner = new Spinner('Indexing item column... %s  ');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    await client.exec('CREATE INDEX idx_app_id ON reviews(item)');

    spinner.setSpinnerTitle('Indexing author column... %s  ');
    await client.exec('CREATE INDEX idx_author_id ON reviews(author)');

    spinner.setSpinnerTitle('Indexing review column... %s  ');
    await client.exec('CREATE INDEX idx_item_id ON reviews(id)');

    spinner.stop();

    const indexEnd = new Date().getTime();
    const indexTime = indexEnd - indexStart;

    console.log(`\nTotal time to index: ${indexTime} ms`);
    console.log('Closing connection... ');
  } catch (e) {
    console.log(e);
  } finally {
    await client.shutdown();
  }
};

module.exports = seedCassandra;
