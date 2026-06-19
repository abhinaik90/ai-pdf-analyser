// src/routes/documentRoutes.js
//
// Routes for document upload/management.
// Currently exposes: POST /upload (mounted at /api/documents/upload
// once this router is registered in routes/index.js).

const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { uploadDocument } = require('../controllers/documentController');

// Multer's middleware can fail in ways that, by default, would just get
// passed to Express's generic error handler (often producing an HTML
// response). We wrap it here so every failure mode — file too large,
// any other Multer error, or an unexpected error — returns the same
// JSON error shape as the rest of the API.
const handleUpload = (req, res, next) => {
  const multerUpload = upload.single('file');

  multerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'File is too large. Maximum allowed size is 50 MB.',
        });
      }

      // Any other Multer-specific error (e.g. unexpected field name).
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    }

    if (err) {
      // Non-Multer error (e.g. disk write failure).
      console.error('Unexpected upload failure:', err);
      return res.status(500).json({
        success: false,
        message: 'File upload failed due to a server error.',
      });
    }

    // No error — hand off to the controller, which checks req.file
    // and builds the success/"missing file" response.
    next();
  });
};

// POST /api/documents/upload
router.post('/upload', handleUpload, uploadDocument);

module.exports = router;