// validators/authValidator.js
//
// WHY THIS FILE EXISTS:
// Validation rules live here, separate from controllers, so the controller's
// only job stays "talk to the service and respond" - it never has to think
// about what counts as a valid email or password. These rules run as
// middleware BEFORE the controller is reached.

const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Rules for POST /api/auth/register
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or fewer'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(), // lowercases + trims common formatting variations

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

// Rules for POST /api/auth/login
// NOTE: we deliberately do NOT enforce isLength/isEmail strictly here beyond
// "not empty" + "looks like an email" - we don't want validation errors to
// reveal info about password rules to someone probing the login endpoint.
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

// Shared middleware: checks whether any of the rules above failed.
// If they did, it collects all messages into one ApiError(400, ...) and
// forwards it to errorHandler.js - the controller is never reached.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return next(new ApiError(400, message));
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
