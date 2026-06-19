// routes/authRoutes.js
//
// WHY THIS FILE EXISTS:
// This file ONLY defines URLs and which middleware/controller handles them.
// It contains no logic itself - just wiring. Read top to bottom and you can
// see exactly what happens, in order, for each endpoint.

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require('../validators/authValidator');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
// Flow: validate input -> check for validation errors -> register the user
router.post(
  '/register',
  registerValidationRules,
  validate,
  asyncHandler(authController.register)
);

// POST /api/auth/login
// Flow: validate input -> check for validation errors -> log the user in
router.post(
  '/login',
  loginValidationRules,
  validate,
  asyncHandler(authController.login)
);

// GET /api/auth/profile  (PROTECTED - requires a valid JWT)
// Flow: verify token (attaches req.user) -> fetch fresh data from the database
router.get('/profile', protect, asyncHandler(authController.getProfile));

// GET /api/auth/me  (PROTECTED - requires a valid JWT)
// Flow: verify token (attaches req.user) -> return what's in the token, no DB call
router.get('/me', protect, asyncHandler(authController.getMe));

module.exports = router;
