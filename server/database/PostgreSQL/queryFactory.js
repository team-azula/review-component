/* Import Modules */
const short = require('short-uuid');
const { getConnectionClient } = require('./index');

const queryTypes = {
  SELECT: 'SELECT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

/**
 * Select Dynamically
 * @param queryType {{}}
 * @param rootParam {string} - The root param to use in SELECT statements
 * @param [supplementParam] {string} - The supplemental param to use in SELECT statements
 * @param [columnOverride] {string} - Override the name of the column to be retrieved from
 * @param [newData] {string} - Data to be used in update queries
 * @param [cacheSuffix] {string} - Suffix to append to the end of the prepared query name
 * @param [returnDataAfterUpdate] - Return data back from the query after update queries
 * @returns {{name: string, text: string}}
 */
const buildQuery = (
  queryType,
  rootParam,
  supplementParam,
  columnOverride,
  newData,
  cacheSuffix,
  returnDataAfterUpdate
) => {
  let column;
  let queryName;

  if (columnOverride) {
    queryName = `${queryType}-`;
    column = columnOverride;
  } else if (Number(rootParam)) {
    queryName = `${queryType}-`;
    column = 'item';
  } else {
    queryName = `${queryType}-`;
    column = 'author';
  }

  let queryString;

  switch (queryType) {
    case queryTypes.SELECT:
      queryString = `SELECT * FROM reviews WHERE ${column} = '${rootParam}'`;
      break;
    case queryTypes.UPDATE:
      queryString = `UPDATE reviews SET ${newData} WHERE ${column} = '${rootParam}'`;
      break;
    case queryTypes.DELETE:
      queryString = `DELETE FROM reviews WHERE ${column} = '${rootParam}'`;
      break;
    default:
      return { name: 'empty-query', text: '' };
  }

  if (supplementParam) {
    queryName += '-and-_id';
    queryString += ` AND _id = '${supplementParam}'`;
  }

  if (returnDataAfterUpdate) {
    queryString += ' RETURNING _id, author, body, item, rating, likes';
  }

  if (cacheSuffix) {
    queryName += cacheSuffix;
  }

  return {
    name: `${queryName}-${rootParam}-${supplementParam}`,
    text: queryString,
  };
};

/**
 * Get All
 * @param searchParam
 * @param reviewId
 * @returns {Promise<number|NumberConstructor|any[]>}
 */
module.exports.getAll = async (searchParam, reviewId) => {
  if (searchParam) {
    const queryOpts = buildQuery(queryTypes.SELECT, searchParam);
    const result = await getConnectionClient().query(queryOpts);
    return result.rows;
  }
  /* IF searching by review _id, query the database for the particular review _id*/
  if (reviewId) {
    const queryOpts = buildQuery(queryTypes.SELECT, reviewId, null, '_id');
    const result = await getConnectionClient().query(queryOpts);
    if (result.rows[0]) {
      return result.rows[0].likes;
    }
    return 0;
  }
};

/**
 * Get One
 * @param searchParam
 * @param reviewId
 * @returns {Promise<*>}
 */
module.exports.getOne = async (searchParam, reviewId) => {
  const queryOpts = buildQuery(queryTypes.SELECT, searchParam, reviewId);
  const result = await getConnectionClient().query(queryOpts);
  return result.rows;
};

/**
 * Create One
 * @param reviewData {{}} - Date to be inserted into the database
 * @returns {Promise<any>}
 */
module.exports.createOne = async (reviewData) => {
  const { item, author, body, rating } = reviewData;
  const result = await getConnectionClient().query(
    `INSERT INTO reviews(_id, author, body, item, rating, likes) VALUES ('${short.generate()}', '${author}', '${body}', ${item}, ${rating}, 0) RETURNING _id, author, body, item, rating, likes`
  );
  return result.rows[0];
};

/**
 * Update One
 * @param searchParam {string} - The root parameter to use for search queries
 * @param reviewId {number | string} - The _id of the review to update
 * @param reviewData
 * @returns {Promise<number | NumberConstructor | QueryResult<any>>}
 */
module.exports.updateOne = async (searchParam, reviewId, reviewData) => {
  if (searchParam && reviewData) {
    const { item, author, body, rating } = reviewData;
    const queryOpts = buildQuery(
      queryTypes.UPDATE,
      searchParam,
      reviewId,
      null,
      `item = ${item}, author = '${author}', body = '${body}', rating = ${rating}`,
      null,
      true
    );
    const result = await getConnectionClient().query(queryOpts);
    return result.rows[0];
  }

  if (reviewId) {
    const queryOpts = buildQuery(
      queryTypes.UPDATE,
      reviewId,
      null,
      '_id',
      'likes = likes + 1',
      '-increment',
      true
    );
    const result = await getConnectionClient().query(queryOpts);
    if (result.rows[0]) {
      return result.rows[0].likes;
    }
    return 0;
  }
};

/**
 * Delete One
 * @param searchParam {string} - The root parameter to search by
 * @param reviewId {number} - The _id of the review to delete
 * @returns {Promise<number|NumberConstructor>}
 */
module.exports.deleteOne = async (searchParam, reviewId) => {
  if (searchParam) {
    const queryOpts = buildQuery(queryTypes.DELETE, searchParam, reviewId);
    const result = await getConnectionClient().query(queryOpts);
    return result.rowCount;
  }

  if (reviewId) {
    const queryOpts = buildQuery(
      queryTypes.UPDATE,
      reviewId,
      null,
      '_id',
      'likes = likes - 1',
      '-decrement',
      true
    );
    const result = await getConnectionClient().query(queryOpts);
    if (result.rows[0]) {
      return result.rows[0].likes;
    }
    return 0;
  }
};

/**
 * Delete All
 * @param searchParam {string} - The root parameter to search by
 * @returns {Promise<number>}
 */
module.exports.deleteAll = async (searchParam) => {
  const queryOpts = buildQuery(queryTypes.DELETE, searchParam);
  const result = await getConnectionClient().query(queryOpts);
  return result.rowCount;
};
