// middleware/authMiddleware.js
//
// WHY THIS FILE EXISTS:
// Any route that should only be accessible to logged-in users (e.g.
// GET /api/auth/profile, and later: PDF upload, chat endpoints) needs to
// check for a valid JWT before letting the request through. Putting that
// logic here means routes just add one line - `protect` - instead of
// repeating token-checking code everywhere.

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

/**
 * Expects an Authorization header in the form:
 *   Authorization: Bearer <token>
 *
 * On success, attaches the decoded token payload to req.user and calls
 * next() so the request continues to the controller.
 * On failure, throws an ApiError(401, ...) which asyncHandler forwards
 * to errorHandler.js.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized - no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, name, email, iat, exp }
    next();
  } catch (err) {
    // Covers both an invalid signature AND an expired token -
    // jwt.verify throws for both cases.
    throw new ApiError(401, 'Not authorized - invalid or expired token');
  }
};

module.exports = { protect };
