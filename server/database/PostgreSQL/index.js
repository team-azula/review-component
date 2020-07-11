/* Import Modules */
const { Client } = require('pg');
const dbDebug = require('debug')('database:startup');

/* Create the postgreSQL client */
const creationClient = new Client({ database: 'postgres' });
let connectionClient;

const getConnectionClient = () => {
  return connectionClient;
};

const createDatabase = async () => {
  try {
    await creationClient.connect();
    await creationClient.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
  } catch (e) {
    // Postgres does not have a built in method for CREATE DATABASE IF NOT EXISTS
    // ignored - database exists
  } finally {
    await creationClient.end();
  }
};

/**
 * Connect to the PostgreSQL database
 * @returns {Promise<Client>}
 */
const connectToDatabase = async () => {
  try {
    await createDatabase();
    connectionClient = new Client({
      database: process.env.DATABASE_NAME,
    });
    await connectionClient.connect();

    /* Create the reviews table if it doesn't exist */
    await connectionClient.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        _id VARCHAR PRIMARY KEY,
        item INT,
        author VARCHAR,
        body VARCHAR,
        rating INT,
        likes INT
        );`);

    dbDebug(`Postgres running on port ${process.env.PGPORT} `);
  } catch (e) {
    dbDebug(e);
  }
  return connectionClient;
};

module.exports.createDatabase = createDatabase;
module.exports.connectToDatabase = connectToDatabase;
module.exports.getConnectionClient = getConnectionClient;
