/* Import Modules */
const path = require('path');
const express = require('express');
const xssClean = require('xss-clean');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const reviewRouter = require('./routes/reviewRoutes');

// Initialize the app as our express framework
const app = express();

/* Security */
app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(compression());

// Allow the app to use the body-parser middleware so we can accept JSON body data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// All requests flowing into the /api route will be rate-limited
app.use('/', reviewRouter);

// Serve up the dist folder from the client
app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ROUTE HANDLER FOR NON-EXISTENT ROUTES
app.all('*', (req, res) => {
  res
    .status(404)
    .json({ message: `Can't find ${req.originalUrl} on this server!` });
});

// Export the App module
module.exports = app;
