// services/authService.js
//
// WHY THIS FILE EXISTS:
// This is where the actual business logic of authentication lives:
// hashing passwords, checking credentials, generating JWTs, and deciding
// what counts as an error (e.g. "email already taken"). Controllers stay
// thin - they just call these functions and send back whatever is returned.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

/**
 * Generates a signed JWT containing the user's id, name, and email.
 * Keeping the payload small on purpose - the token is decoded on every
 * protected request, so we only embed what's cheap and useful to have
 * without hitting the database (see authMiddleware.js + GET /me).
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Removes password_hash from a user object before it's ever sent in an
 * API response. Defensive even though our repository queries already
 * exclude it in most places - this is a last line of defense.
 */
const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

/**
 * Registration flow:
 *   1. Reject if the email is already taken
 *   2. Hash the password (NEVER store plaintext)
 *   3. Create the user row
 *   4. Issue a JWT so the user is immediately logged in after registering
 */
const registerUser = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    // 409 Conflict = "this resource already exists"
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

  const newUser = await userRepository.createUser({ name, email, passwordHash });
  const token = generateToken(newUser);

  return { user: newUser, token };
};

/**
 * Login flow:
 *   1. Look up the user by email
 *   2. Compare the submitted password against the stored hash
 *   3. Check the account hasn't been deactivated
 *   4. Record the login time
 *   5. Issue a JWT
 *
 * SECURITY NOTE: we intentionally use the SAME error message whether the
 * email doesn't exist or the password is wrong ("Invalid email or
 * password"). This prevents an attacker from being able to tell which
 * emails are registered just by trying to log in with them.
 */
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  await userRepository.updateLastLogin(user.id);

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

/**
 * Used by GET /api/auth/profile - does a FRESH database lookup so the
 * response always reflects the current state of the account (e.g. if
 * is_active or name changed since the token was issued).
 */
const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  generateToken, // exported for potential reuse/testing
};
