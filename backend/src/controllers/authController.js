// controllers/authController.js
//
// WHY THIS FILE EXISTS:
// Controllers are intentionally "thin": read the request, call a service,
// shape the response. No SQL, no password hashing, no JWT logic happens
// here - all of that lives in authService.js. This keeps controllers easy
// to read and easy to test.
//
// NOTE: these functions are plain async functions. They get wrapped in
// asyncHandler() at the point they're registered in routes/authRoutes.js,
// so any thrown error (e.g. ApiError) is automatically forwarded to
// errorHandler.js - no try/catch needed here.

const authService = require('../services/authService');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user, token },
  });
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user, token },
  });
};

/**
 * GET /api/auth/profile  (protected)
 * Does a fresh database lookup via the service, so this always reflects
 * the user's CURRENT data - not just whatever was in the JWT when it was issued.
 */
const getProfile = async (req, res) => {
  // req.user is attached by authMiddleware.js after verifying the JWT
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

/**
 * GET /api/auth/me  (protected)
 * Returns whatever is embedded in the JWT itself - no database call.
 * Useful for a fast "am I logged in, and who am I" check (e.g. on app
 * load in the frontend) where slightly-stale data is an acceptable
 * trade-off for speed.
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = {
  register,
  login,
  getProfile,
  getMe,
};
