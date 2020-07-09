/**
 * CATCH ASYNC ERROR HANDLER
 * This function returns an anonymous function for Express to call at a later time
 *  Also handles all errors caused inside of functions
 * @param fn {function} The function to return as an anonymous function to use at a later time
 * @returns {function(req, res, next)} function to return as an anonymous function to use at a later time
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
          message: error.message,
          stack: error.stack,
        });
      }
      return res.status(500).json({ message: 'Something went wrong!' });
    });
  };
};
