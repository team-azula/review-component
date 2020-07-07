/* Import Modules */
const path = require('path');
/* Set up the environment variables */
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });

/* Import Debug module */
const serverDebug = require('debug')('server:startup');
const db = require('./database/PostgreSQL');

/* Require the express app into our server instance */
const app = require('./app');

let server;

db.connectToPostgreSQL()
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
