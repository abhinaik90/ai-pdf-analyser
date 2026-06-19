// utils/asyncHandler.js
// WHY THIS FILE EXISTS:
// Every controller function will be `async` (because it awaits services).
// Normally you'd need a try/catch in EVERY controller to forward errors to
// Express's error-handling middleware. This wrapper does that automatically.
//
// HOW TO USE IT:
//   router.post('/login', asyncHandler(authController.login));
//
// If authController.login throws an error (or a promise rejects), asyncHandler
// catches it and passes it to next(err), which sends it to errorHandler.js.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
