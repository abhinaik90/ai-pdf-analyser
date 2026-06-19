// server.js
// WHY THIS FILE EXISTS:
// This is the file you actually run (`node src/server.js`). Its only job is to
// start the server listening on a port. All app configuration lives in app.js.

const app = require('./app');
const config = require('./config/env');
const pool = require('./config/db');

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on http://localhost:${PORT}`);

  // Test the database connection as soon as the server starts, so we find out
  // immediately if PostgreSQL isn't running or credentials are wrong,
  // rather than discovering it later when a user tries to register.
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected successfully');
  } catch (err) {
    console.error('❌ Could not connect to PostgreSQL:', err.message);
  }
});
