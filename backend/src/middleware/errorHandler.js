// middleware/errorHandler.js
// WHY THIS FILE EXISTS:
// Express lets you register a special middleware (4 arguments, with `err` first)
// that catches errors from anywhere in the request lifecycle. This is the ONLY
// place in the app that decides how an error looks to the client. That keeps
// error formatting consistent and keeps controllers/services clean (they just
// `throw`, they don't build response objects).
//
// This must be registered LAST in app.js, after all routes.

const errorHandler = (err, req, res, next) => {
  // If the error has a statusCode (e.g. from ApiError), use it.
  // Otherwise, default to 500 (unexpected server error).
  const statusCode = err.statusCode || 500;

  // Avoid leaking internal error details in production for unexpected (non-operational) errors.
  const message = err.isOperational || process.env.NODE_ENV !== 'production'
    ? err.message
    : 'Something went wrong. Please try again later.';

  if (!err.isOperational) {
    // Log the full error for unexpected bugs so we can debug them.
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
