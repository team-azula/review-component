const database = require('../../database/Cassandra');
const ProgressBar = require('progress');
const chalk = require('chalk');
const util = require('util');
const generateReview = require('./generator');

/**
 * Seed Cassandra Database
 * @param amount {number}
 * @param dbName {string}
 */
const seedCassandra = (dbName, amount) => {
  const seedChunk = () => {};
};

module.exports = seedCassandra;
