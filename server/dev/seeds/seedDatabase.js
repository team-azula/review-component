const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../config/.env'),
});

const inquirer = require('inquirer');
const chalkPipe = require('chalk-pipe');
const seedPostgres = require('./direct_load/psqlSeed');
const { swarmPsql } = require('./swarm/swarmPsql');

(async () => {
  if (process.argv[2] === '-d') {
    process.env.PGCONTAINER = process.argv[3].slice(1);
    return await swarmPsql();
  }

  let skipPrep = false;

  if (process.argv[2] === '-skipPrep') {
    skipPrep = true;
  }

  if (process.argv[2] === '-slug') {
    skipPrep = true;
    await seedPostgres(
      'reviews',
      1000000,
      skipPrep,
      +process.argv[3].substr(1)
    );
  }

  let dbName = process.env.DATABASE_NAME;
  let seedAmount = 100;
  let startFrom = 0;

  const questions = [
    {
      type: 'input',
      name: 'database',
      message: 'Enter the name of the database to seed',
      default: dbName,
    },
    {
      type: 'number',
      name: 'entries',
      message: 'Enter the number of parent entries to create',
      default: seedAmount,
    },
    {
      type: 'number',
      name: 'start',
      message: 'Enter index to start from',
      default: startFrom,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    seedAmount = answers.entries;
    dbName = answers.database;
    startFrom = answers.start;
    process.env.DATABASE_NAME = dbName;

    return inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: chalkPipe('orange.bold')(
            `Seed database: '${answers.database}' with ${answers.entries} entries - starting with index ${answers.start}?`
          ),
        },
      ])
      .then(async (finalAnswer) => {
        if (finalAnswer.confirm)
          await seedPostgres(dbName, seedAmount, skipPrep, startFrom);
      });
  });
})();
