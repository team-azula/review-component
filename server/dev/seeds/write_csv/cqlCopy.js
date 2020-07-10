const path = require('path');
const database = require('../../../database/Cassandra');

module.exports.copyToCassandra = async (dbName) => {
  const client = await database.connectToDatabase();
  await client.execute(
    `COPY ${dbName} FROM '${path.resolve(
      __dirname,
      './seedData.csv'
    )}' WITH DELIMITER=',' AND HEADER=TRUE`
  );
  await client.shutdown();
};
