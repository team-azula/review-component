const path = require('path');

/* Shell script for seeding */
/* cat ./dev/seeds/write_csv/seedData.csv | docker exec -i 1015d4579e99 psql -U admin reviews -c "copy reviews from stdin with(format csv, header true);" */

require('dotenv').config({
  path: path.resolve(__dirname, '../../../config/.env'),
});

const database = require('../../../database/PostgreSQL');

(async () => {
  const client = await database.connectToDatabase();
  await client.query(
    `COPY reviews FROM '${path.resolve(
      __dirname,
      './seedData.csv'
    )}' DELIMITER ',' CSV HEADER`
  );
  // await client.end();
})();
