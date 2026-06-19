// src/services/documentService.js
//
// Document-related API calls. Reuses the shared Axios instance from
// api.js (same pattern as authService.js) so base URL, timeout, and
// error logging stay centralized in one place.

import api from "./api";

/**
 * Upload a single file to the backend.
 *
 * @param {File} file - The browser File object to upload.
 * @param {(percent: number) => void} [onProgress] - Optional callback
 *   invoked with the upload percentage (0-100) as the request progresses.
 *   Not part of the required signature, but lets the Documents page
 *   drive a real progress bar instead of a fake one.
 * @returns {Promise<Object>} The backend response data, e.g.
 *   { success, message, data: { filename, originalName, mimeType, size } }
 */
export const uploadDocument = async (file, onProgress) => {
  // Field name must be "file" to match upload.single('file') on the backend.
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/documents/upload", formData, {
    headers: {
      // Axios sets the multipart boundary automatically; we just need
      // to make sure the request isn't sent as application/json.
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
};

export default {
  uploadDocument,
};