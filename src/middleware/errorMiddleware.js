const { getDBStatus } = require('../config/db');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Check if error is due to database unavailability
  const isDBError = err.message?.includes('MongoError') || 
                    err.message?.includes('connection') ||
                    !getDBStatus();

  let message = err.message || 'Server Error';
  
  if (isDBError && !getDBStatus()) {
    message = 'Database is currently unavailable. Please try again later.';
  }

  res.status(statusCode).json({
    message,
    database_status: getDBStatus() ? 'connected' : 'disconnected',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
