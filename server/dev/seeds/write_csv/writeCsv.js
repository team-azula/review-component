const fs = require('fs');
const path = require('path');
const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const file = fs.createWriteStream(path.resolve(__dirname, './seedData.csv'));
const getNextData = require('../getNextData');

const csvStringifier = createCsvStringifier({
  header: [
    { id: '_id', title: '_ID' },
    { id: 'item', title: 'ITEM' },
    { id: 'author', title: 'AUTHOR' },
    { id: 'body', title: 'BODY' },
    { id: 'rating', title: 'RATING' },
    { id: 'likes', title: 'LIKES' },
  ],
});

/**
 * Generate File
 * @param amount {string | number} - Number of parent items to create
 * @returns {Promise<void>}
 */
const generateFile = async (amount = '-1000') => {
  amount = parseInt(amount.slice(1), 10);
  console.log(`Generating ${amount} entries!`);
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

  file.write(csvStringifier.getHeaderString());

  for (let i = 0; i < chunks; i += 1) {
    await getNextData(null, i, chunkSize, chunks).then(async (data) => {
      const stringifiedData = csvStringifier.stringifyRecords(data);

      if (!file.write(stringifiedData)) {
        await new Promise((resolve) => file.once('drain', resolve));
      }
    });
    creationBar.tick();
  }

  /* File written, complete! */
  file.on('finish', () => {
    file.end();
  });
};

generateFile(process.argv[2]);
