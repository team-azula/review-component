const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'reviews',
  },
});

const chalkPipe = require('chalk-pipe');
const ProgressBar = require('progress');
const getNextData = require('./utils/getNextData');

(async () => {
  /* Create a progress bar to notify the user of bulk creation progress */
  const creationBar = new ProgressBar(
    chalkPipe('green.bold')(
      'Seeding [:bar] :current of :total chunks - :percent - :etas remaining'
    ),
    {
      complete: '=',
      incomplete: ' ',
      width: 50,
      total: 200,
    }
  );

  try {
    for (let i = 0; i < 200; i++) {
      const data = await getNextData(null, i, 1000, 200, 9800000);
      await knex.batchInsert('reviews', data, data.length);
      creationBar.tick();
    }
  } catch (e) {
    console.log(e);
  }
})();
