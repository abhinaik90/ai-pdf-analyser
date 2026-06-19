// repositories/userRepository.js
//
// WHY THIS FILE EXISTS:
// This is the ONLY place in the entire app that writes raw SQL for the
// `users` table. Controllers and services never touch `pool` directly -
// they call functions exported here. This means if we ever change databases
// or rename a column, we only have ONE file to update.

const pool = require('../config/db');

/**
 * Insert a new user row.
 * NOTE: `passwordHash` must already be hashed (bcrypt) before this is called -
 * this repository never hashes anything, it just stores what it's given.
 */
const createUser = async ({ name, email, passwordHash }) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, is_active, created_at, updated_at
  `;
  // We deliberately do NOT return password_hash here - callers of this
  // function should never need it again after creating the row.
  const { rows } = await pool.query(query, [name, email, passwordHash]);
  return rows[0];
};

/**
 * Find a user by email, INCLUDING password_hash.
 * Used only by the login flow, which needs the hash to compare against.
 * Returns undefined if no user has that email.
 */
const findByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password_hash, is_active, last_login_at, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

/**
 * Find a user by id, EXCLUDING password_hash.
 * Used for "get profile" type lookups where we never want the hash
 * leaving the database layer unnecessarily.
 */
const findById = async (id) => {
  const query = `
    SELECT id, name, email, is_active, last_login_at, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

/**
 * Stamp last_login_at with the current time. Called right after a
 * successful login so we have an audit trail of login activity.
 */
const updateLastLogin = async (id) => {
  const query = `
    UPDATE users
    SET last_login_at = now()
    WHERE id = $1
    RETURNING id, last_login_at
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateLastLogin,
};
