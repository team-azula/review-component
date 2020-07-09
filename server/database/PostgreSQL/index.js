/* Import Modules */
const { Client } = require('pg');
const dbDebug = require('debug')('database:startup');

/* Create the postgreSQL client */
const client = new Client();

/**
 * Connect to the PostgreSQL database
 * @returns {Promise<Client>}
 */
module.exports.connectToDatabase = async () => {
  try {
    await client.connect();

    try {
      await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
    } catch (e) {
      // Postgres does not have a built in method for CREATE DATABASE IF NOT EXISTS
      // ignored - database exists
    }

    /* Create the reviews table if it doesn't exist */
    await client.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL UNIQUE,
        author VARCHAR,
        body VARCHAR,
        item INT,
        rating INT,
        likes INT
        );`);

    dbDebug(`Postgres running on port ${process.env.PGPORT} `);
  } catch (e) {
    dbDebug(e);
  }
  return client;
};

module.exports.client = client;
