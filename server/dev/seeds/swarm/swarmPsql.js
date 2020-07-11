const PromiseBar = require('promise.bar');
const chalk = require('chalk');
const { Spinner } = require('cli-spinner');
const { execSync } = require('child_process');

PromiseBar.enable();

const { writeCsv } = require('../utils/writeCsv');
const { uploadCsv } = require('../utils/uploadCsv');

module.exports.swarmPsql = async () => {
  const start = new Date().getTime();

  const PRIMARY_RECORDS = 10000000;
  const CHUNK_SIZE = 100;
  let WORKER_GROUP_SIZE = 100;
  const NUM_CHUNKS = PRIMARY_RECORDS / CHUNK_SIZE;

  if (WORKER_GROUP_SIZE > NUM_CHUNKS) {
    WORKER_GROUP_SIZE = NUM_CHUNKS;
  }

  console.log('\n -------- STARTING UPLOAD SWARM ----------');
  console.log(` | TOTAL RECORDS: ${PRIMARY_RECORDS}`);
  console.log(` | NUMBER OF CHUNKS: ${NUM_CHUNKS}`);
  console.log(` | WORKER GROUP SIZE: ${WORKER_GROUP_SIZE}`);
  console.log(' ------------------------------------------\n');

  let chunksRemaining = NUM_CHUNKS;
  let iteration = 1;

  while (chunksRemaining > 0) {
    let chunkGenerations = [];

    for (let i = 0; i < WORKER_GROUP_SIZE; i++) {
      chunkGenerations.push(writeCsv(i, CHUNK_SIZE, uploadCsv));
    }

    await PromiseBar.all(chunkGenerations, {
      label: chalk.blue(
        `Worker Group ${iteration} of ${NUM_CHUNKS / WORKER_GROUP_SIZE}`
      ),
      barFormat: chalk.dim.blue,
      filled: '=',
      empty: ' ',
    });

    console.log(
      `\n ---------- WORKER GROUP ${iteration} COMPLETE ----------\n`
    );

    iteration++;
    chunksRemaining -= WORKER_GROUP_SIZE;
    chunkGenerations = null;
  }

  const spinner = new Spinner('Indexing item column... %s  ');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  execSync(
    `docker exec -i ${process.env.PGCONTAINER} psql -U admin reviews -c "CREATE INDEX IF NOT EXISTS idx_app_id ON reviews(item)"`,
    { stdio: ['pipe', 'pipe', 'ignore'] }
  );

  spinner.setSpinnerTitle('Indexing author column... %s  ');

  execSync(
    `docker exec -i ${process.env.PGCONTAINER} psql -U admin reviews -c "CREATE INDEX IF NOT EXISTS idx_app_author ON reviews(author)"`,
    { stdio: ['pipe', 'pipe', 'ignore'] }
  );

  spinner.stop();

  const end = new Date().getTime();
  const time = end - start;
  console.log(`\nTotal time to seed & index: ${time} ms`);
};
