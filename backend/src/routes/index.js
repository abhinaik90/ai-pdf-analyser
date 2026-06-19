// routes/index.js
// WHY THIS FILE EXISTS:
// This is the single entry point for all API routes. app.js only needs to know
// about THIS file, not every individual route file. As we build each phase
// (auth routes, PDF routes, chat routes), we'll `require` and `use` them here.
//
// Example of what this will look like after Phase 1:
//   const authRoutes = require('./auth.routes');
//   router.use('/auth', authRoutes);

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const documentRoutes = require('./documentRoutes');

// Simple health check endpoint - useful to confirm the server is running
// and to check from the frontend that the API is reachable.
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is up and running' });
});

// Phase 1: Authentication
// All auth endpoints are now available under /api/auth/*
// e.g. POST /api/auth/register, POST /api/auth/login
router.use('/auth', authRoutes);

// Phase 3: File Upload
// All document endpoints are now available under /api/documents/*
// e.g. POST /api/documents/upload
router.use('/documents', documentRoutes);

module.exports = router;