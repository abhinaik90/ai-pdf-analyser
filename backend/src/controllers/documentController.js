// src/controllers/documentController.js
//
// Controller for document-related endpoints.
// By the time this runs, Multer (uploadMiddleware.js) has already
// processed the incoming request: if a file was attached under the
// "file" field and passed validation, it will be available on req.file.

/**
 * POST /api/documents/upload
 * Expects a single file under the form field name "file".
 */
const uploadDocument = (req, res) => {
  // If no file was attached at all, req.file will be undefined.
  // (Multer-specific errors like "file too large" are already caught
  // earlier in documentRoutes.js and never reach this controller.)
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file was uploaded. Attach a file under the "file" field.',
    });
  }

  try {
    const { filename, originalname, mimetype, size } = req.file;

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
      },
    });
  } catch (error) {
    // Safety net for anything unexpected while building the response
    // (e.g. malformed req.file) — should rarely, if ever, trigger.
    console.error('Upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'File upload failed due to a server error.',
    });
  }
};

module.exports = {
  uploadDocument,
};