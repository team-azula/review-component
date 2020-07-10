/* Import Modules */
const dbDebug = require('debug')('database:startup');
const cassandra = require('cassandra-driver');

const { distance } = cassandra.types;

/**
 * Connect to Database
 * @returns {Promise<Client>}
 */
module.exports.connectToDatabase = async () => {
  const createKsQuery =
    "CREATE KEYSPACE IF NOT EXISTS reviews WITH REPLICATION = {  'class'  : 'SimpleStrategy'," +
    " 'replication_factor' : 1 }";

  // Table Queries
  // Q1 Get All Reviews By Item
  // Q1 Get/Update/Delete One review by Author
  // Q2 Get/Update/Delete One review by Item
  // Q3 Get/Update/Delete likes by reviewId

  const createReviewByItemTb =
    'CREATE TABLE IF NOT EXISTS reviews_by_item (item int, reviewIds blob, PRIMARY KEY (item))';

  const createReviewByAuthorTb =
    'CREATE TABLE IF NOT EXISTS reviews_by_author (author text, reviewIds blob, PRIMARY KEY (author))';

  const createReviewTb =
    'CREATE TABLE IF NOT EXISTS review_by_id (reviewId text, author text, body text, item int, rating int, likes' +
    ' int, PRIMARY KEY (reviewId))';

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
    await client.execute(createReviewByItemTb);
    await client.execute(createReviewByAuthorTb);
    await client.execute(createReviewTb);

    dbDebug(`Cassandra running on port ${process.env.CQL_PORT}`);
  } catch (e) {
    dbDebug(e);
  }

  return client;
};
