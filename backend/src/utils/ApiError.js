// utils/ApiError.js
// WHY THIS FILE EXISTS:
// Plain `throw new Error('message')` doesn't let us attach an HTTP status code.
// This small class extends the built-in Error so services/controllers can throw
// errors that already know their status code (e.g. 400, 401, 404).
//
// EXAMPLE USAGE (in a service):
//   if (!user) throw new ApiError(404, 'User not found');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    // Distinguishes errors we threw on purpose ("operational") from
    // unexpected bugs/crashes, which can be useful for logging later.
    this.isOperational = true;
  }
}

module.exports = ApiError;
