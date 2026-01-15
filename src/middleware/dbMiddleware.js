const { getDBStatus } = require('../config/db');

const checkDatabaseConnection = (req, res, next) => {
  if (!getDBStatus()) {
    res.status(503);
    return next(new Error('Database connection unavailable. Please try again later.'));
  }
  next();
};

module.exports = { checkDatabaseConnection };
