// src/middleware/uploadMiddleware.js
//
// Configures Multer for handling file uploads:
//   - Files are written to backend/uploads/ on disk.
//   - Every filename is made unique so two uploads never overwrite
//     each other, even if the original filenames are identical.
//   - All file types are accepted (no fileFilter rejection).
//   - Max file size is capped at 50 MB; Multer throws a MulterError
//     with code "LIMIT_FILE_SIZE" if a file exceeds this, which is
//     handled in documentRoutes.js.

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Resolve backend/uploads/ as an absolute path.
// __dirname here is backend/src/middleware, so we go up two levels
// to reach backend/, then into uploads/.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// Multer won't create the destination folder for us — make sure it
// exists before any upload attempt, otherwise writes will fail.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- Storage engine -----------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  // Unique filename = timestamp + random hex string + original extension.
  // Keeping the original extension matters so the stored file can still
  // be opened/served with the correct type later.
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// --- File filter -----------------------------------------------------
// Requirement: accept ALL file types, so we never reject based on
// mimetype/extension here.
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// --- Limits ------------------------------------------------------------
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

module.exports = upload;