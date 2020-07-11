const fs = require('fs');
const path = require('path');
const log = require('single-line-log').stdout;

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const getNextData = require('./getNextData');

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
 * @returns {Promise<string>}
 * @param chunkSize - The amount primary records to create
 * @param chunk - The current chunk to process
 * @param cb
 */
module.exports.writeCsv = async (chunk, chunkSize, cb) => {
  log(` - WRITING CHUNK ${chunk + 1}`);
  const filePath = path.resolve(__dirname, `../files/seedData_${chunk}.csv`);

  /* Create the write stream */
  const file = fs.createWriteStream(filePath);

  /* Write the CSV headers to the file */
  file.write(csvStringifier.getHeaderString());

  /* Get the next chunk of data */
  const data = await getNextData(null, chunk, chunkSize, chunk + 1);
  const stringifiedData = await csvStringifier.stringifyRecords(data);

  /* If file-stream is full, await the drain event before continuing */
  if (!file.write(stringifiedData)) {
    await new Promise((resolve) => file.once('drain', resolve));
  }

  /* File written, complete! */
  const written = new Promise((resolve, reject) => {
    file.on('finish', () => {
      resolve(cb(filePath, chunk + 1));
    });

    file.on('error', (e) => {
      reject(e);
    });
  });

  file.end();
  return written;
};
