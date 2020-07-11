const { Spinner } = require('cli-spinner');
const { execSync } = require('child_process');
const log = require('single-line-log').stdout;

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
  console.log(` | - TOTAL RECORDS: ${PRIMARY_RECORDS}`);
  console.log(` | - NUMBER OF CHUNKS: ${NUM_CHUNKS}`);
  console.log(` | - WORKER GROUP SIZE: ${WORKER_GROUP_SIZE}`);
  console.log(' ------------------------------------------\n');

  let chunksRemaining = NUM_CHUNKS;
  let iteration = 1;

  while (chunksRemaining > 0) {
    const loopStart = new Date().getTime();
    let chunkGenerations = [];

    for (let i = 0; i < WORKER_GROUP_SIZE; i++) {
      chunkGenerations.push(writeCsv(i, CHUNK_SIZE, uploadCsv));
    }

    const insertions = await Promise.all(chunkGenerations);
    const insertionCount = insertions.reduce((a, b) => a + b);

    const loopEnd = new Date().getTime();
    const loopTime = loopEnd - loopStart;

    log(` ---- INSERTED ${insertionCount} RECORDS IN ${loopTime} ms`);

    console.log(
      `\n\n ---------- WORKER GROUP ${iteration} OF ${
        NUM_CHUNKS / WORKER_GROUP_SIZE
      } COMPLETE ----------\n`
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

  console.log('\n -------- SWARM COMPLETE ----------');
  console.log(`| - TOTAL TIME: ${time} ms`);
  console.log(' ----------------------------------\n');
};
