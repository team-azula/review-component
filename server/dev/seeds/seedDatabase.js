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
    return seedPostgres('reviews', 100000, skipPrep);
  }

  let dbName = process.env.DATABASE_NAME;
  let seedAmount = 100;

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
  ];

  inquirer.prompt(questions).then((answers) => {
    seedAmount = answers.entries;
    dbName = answers.database;
    process.env.DATABASE_NAME = dbName;

    return inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: chalkPipe('orange.bold')(
            `Seed database: '${answers.database}' with ${answers.entries} entries?`
          ),
        },
      ])
      .then(async (finalAnswer) => {
        if (finalAnswer.confirm)
          return seedPostgres(dbName, seedAmount, skipPrep);
      });
  });
})();
