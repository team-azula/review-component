/* Import Modules */
const path = require('path');

/* Set up the environment variables */
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });

/* Import Debug module */
const serverDebug = require('debug')('server:startup');

/* Require the express app into our server instance */
const app = require('./app');

// Start the server listening on the predefined PORT variable
const server = app.listen(process.env.PORT, () => {
  serverDebug(`Server running on port: ${process.env.PORT}`);
});

// Export the server module
module.exports = server;
