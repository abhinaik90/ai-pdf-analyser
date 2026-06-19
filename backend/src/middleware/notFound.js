// middleware/notFound.js
// WHY THIS FILE EXISTS:
// If a request hits a URL that doesn't match ANY route (e.g. a typo'd endpoint),
// Express would otherwise send a generic, unhelpful HTML error page.
// This middleware catches that case and forwards a clean 404 JSON error
// to our errorHandler instead. Register this AFTER all routes, BEFORE errorHandler.

const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
