const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../config/.env'),
});

const inquirer = require('inquirer');
const chalkPipe = require('chalk-pipe');

const seedPostgres = require('./direct_load/psqlSeed');
const seedCassandra = require('./direct_load/csqlSeed');

const { generateFile } = require('./write_csv/writeCsv');
const { copyToPostgres } = require('./write_csv/psqlCopy');
const { copyToCassandra } = require('./write_csv/cqlCopy');

const CQL_IDENTIFIER = 'CQL';
const PSQL_IDENTIFIER = 'PSQL';

let dbName = process.env.DATABASE_NAME;
let seedAmount = 100;
let dbms = null;

if (process.argv[2] === '-c') {
  dbms = CQL_IDENTIFIER;
}

if (process.argv[2] === '-p') {
  dbms = PSQL_IDENTIFIER;
}

if (dbms === null) {
  // eslint-disable-next-line no-console
  return console.log(
    'Please enter a command flag: -c (for cql) or -p (for psql)'
  );
}

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
      if (finalAnswer.confirm) {
        // eslint-disable-next-line no-unused-expressions
        dbms === CQL_IDENTIFIER
          ? seedCassandra(dbName, seedAmount)
          : seedPostgres(dbName, seedAmount);
      }
    });
});
