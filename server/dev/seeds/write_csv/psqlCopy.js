const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../../config/.env'),
});

const database = require('../../../database/PostgreSQL');

(async () => {
  const client = await database.connectToDatabase();
  await client.query(
    `COPY ${process.argv[2]} FROM '${path.resolve(
      __dirname,
      './seedData.csv'
    )}' DELIMITER ',' CSV HEADER`
  );
  await client.end();
})();
