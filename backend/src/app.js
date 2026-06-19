// app.js
// WHY THIS FILE EXISTS:
// We separate "configuring the Express app" (this file) from "starting the
// server / listening on a port" (server.js). This separation is a common
// best practice because it lets us import `app` in automated tests without
// actually starting a live server on a port.

const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ===== GLOBAL MIDDLEWARE =====
app.use(cors()); // Allows the React frontend (different port/origin) to call this API
app.use(express.json()); // Parses incoming JSON request bodies into req.body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

// ===== ROUTES =====
// All API routes are prefixed with /api, e.g. /api/health, /api/auth/login
app.use('/api', routes);

// ===== ERROR HANDLING (must be registered LAST) =====
app.use(notFound); // Catches unmatched routes -> turns them into a 404 error
app.use(errorHandler); // Catches ALL errors and sends a consistent JSON response

module.exports = app;
