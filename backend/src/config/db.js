// config/db.js
// WHY THIS FILE EXISTS:
// This creates ONE shared connection "pool" to PostgreSQL that the whole app reuses.
// Repositories (the database-access layer) will import `pool` from here to run queries.
// We never put raw SQL in controllers/services - only repositories talk to this pool.

const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
});

// Quick sanity check when the server starts - tells us immediately if
// the database credentials/connection are wrong, instead of failing later.
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client:', err.message);
});

module.exports = pool;
