/* Import Modules */
const path = require('path');
/* Set up the environment variables */
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });

/* Import Debug module */
const serverDebug = require('debug')('server:startup');

/* Dynamically load Postgres or Cassandra depending on the chosen CORE_DB */
const { connectToDatabase } =
  process.env.CORE_DB === 'PSQL'
    ? require('./database/PostgreSQL')
    : require('./database/Cassandra');

/* Require the express app into our server instance */
const app = require('./app');

let server;

connectToDatabase()
  .then(() => {
    server = app.listen(process.env.PORT, () => {
      serverDebug(`Server running on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    serverDebug(error);
  });

// Export the server module
module.exports = server;
