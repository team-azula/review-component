/* Import Modules */
const { Client } = require('pg');
const dbDebug = require('debug')('database:startup');

/* Create the postgreSQL client */
const client = new Client();

/**
 * Connect to the PostgreSQL database
 * @returns {Promise<void>}
 */
module.exports.connectToPostgreSQL = async () => {
  await client.connect();
  dbDebug(`Postgres running on port ${process.env.PGPORT} `);
  return client;
};
