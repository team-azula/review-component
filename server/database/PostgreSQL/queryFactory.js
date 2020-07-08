/* Import Modules */
const { client } = require('./index');

/**
 * Select Dynamically
 * @param rootParam {string} - The root param to use in SELECT statements
 * @param supplementParam {string | null} - The supplemental param to use in SELECT statements
 * @param columnOverride {string | null | undefined} - Override the name of the column to be retrieved from
 * @returns {{values: [number], name: string, text: string}}
 */
const selectDynamically = (rootParam, supplementParam, columnOverride) => {
  let column;
  let queryName;

  if (columnOverride) {
    queryName = 'fetch-likes-by-item';
    column = columnOverride;
  } else if (Number(rootParam)) {
    queryName = 'fetch-reviews-by-item';
    column = 'item';
    rootParam = parseInt(rootParam, 10);
  } else {
    queryName = 'fetch-reviews-by-author';
    column = 'author';
  }

  const queryVals = [rootParam];
  let queryString = `SELECT * FROM reviews WHERE ${column} = $1`;

  if (supplementParam) {
    queryName += '-and-id';
    queryString += ' AND id = $2';
    queryVals.push(supplementParam);
  }

  return {
    name: queryName,
    text: queryString,
    values: queryVals,
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
    const queryOpts = selectDynamically(searchParam);
    const result = await client.query(queryOpts);
    return result.rows;
  }
  /* IF searching by review id, query the database for the particular review id*/
  if (reviewId) {
    const queryOpts = selectDynamically(reviewId, null, 'id');
    const result = await client.query(queryOpts);
    return result.rows[0].likes;
  }
};

/**
 *
 * @param searchParam
 * @param reviewId
 * @returns {Promise<*>}
 */
module.exports.getOne = async (searchParam, reviewId) => {
  const queryOpts = selectDynamically(searchParam, reviewId, null);
  const result = await client.query(queryOpts);
  return result.rows;
};

module.exports.createOne = async (reviewData) => {};
module.exports.updateOne = async (searchParam, reviewId) => {};
module.exports.deleteOne = async (searchParam, reviewId) => {};
module.exports.deleteAll = async (searchParam, reviewId) => {};
