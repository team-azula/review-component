/* Import Modules */
const dbDebug = require('debug')('database:startup');
const cassandra = require('cassandra-driver');

/**
 * Connect to Database
 * @returns {Promise<Client>}
 */
module.exports.connectToDatabase = async () => {
  const createKsQuery =
    "CREATE KEYSPACE IF NOT EXISTS reviews WITH REPLICATION = {  'class'  : 'SimpleStrategy'," +
    " 'replication_factor' : 1 }";

  const createTbQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
        id text,
        author text,
        body text,
        item int,
        rating int,
        likes int,
        PRIMARY KEY (id)
        )`;

  let client;

  /* Connect to the client */
  try {
    client = new cassandra.Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      protocolOptions: {
        port: process.env.CQL_PORT,
      },
    });

    /* Connect to the client, create a keyspace and table if they do not exist*/
    await client.connect();
    await client.execute(createKsQuery);
    await client.execute('USE reviews');
    await client.execute(createTbQuery);

    dbDebug(`Cassandra running on port ${process.env.CQL_PORT}`);
  } catch (e) {
    dbDebug(e);
  }

  return client;
};
