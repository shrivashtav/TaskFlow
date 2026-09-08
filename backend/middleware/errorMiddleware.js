const { sendError } = require('../utils/apiResponse');

// 404 Route Not Found Handler
const notFoundHandler = (req, res, next) => {
  return sendError(res, 404, `API Route not found: ${req.method} ${req.originalUrl}`);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] [${req.method} ${req.originalUrl}]:`, err);

  // Handle MySQL duplicate key error (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 400, 'A record with these details already exists.');
  }

  // Handle MySQL foreign key constraint failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return sendError(res, 400, 'Database relationship constraint violated.');
  }

  // Fallback generic 500 error
  const statusCode = err.statusCode || 500;
  const message = err.message && statusCode !== 500 
    ? err.message 
    : 'An unexpected internal server error occurred. Please try again later.';

  return sendError(res, statusCode, message);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
