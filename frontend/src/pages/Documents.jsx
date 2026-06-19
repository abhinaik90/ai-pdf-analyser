// src/pages/Documents.jsx
//
// Documents page: lets the user pick/drop a single file, upload it to
// the backend via documentService, and see progress/success/error
// states. Layout comes from the existing MainLayout (not modified).
// Upload logic/behavior is unchanged from the previous version — only
// the success/error presentation was redesigned to be compact.

import { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import UploadBox from "../components/Upload/UploadBox";
import FileList from "../components/Upload/FileList";
import UploadProgress from "../components/Upload/UploadProgress";
import { uploadDocument } from "../services/documentService";

// NOTE: sized with valid Tailwind steps (h-5/w-5), not the invalid
// "h-4.5/w-4.5" used previously — that typo was why the success
// checkmark rendered huge instead of as a small icon.
const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AlertCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

// Same formatting helper used in FileList.jsx, kept local here since
// it isn't exported from that component.
const formatFileSize = (bytes) => {
  if (bytes === 0 || bytes == null) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
};

const Documents = () => {
  // The single file currently picked, waiting to be uploaded.
  const [selectedFile, setSelectedFile] = useState(null);

  // Upload lifecycle state.
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Result state — only one of these is populated at a time.
  const [uploadedFile, setUploadedFile] = useState(null); // backend's "data" object
  const [errorMessage, setErrorMessage] = useState("");

  // UploadBox can hand back multiple files, but this page's flow is
  // single-file: take the first one and clear any previous result.
  const handleFilesSelected = (files) => {
    setSelectedFile(files[0]);
    setUploadedFile(null);
    setErrorMessage("");
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    setErrorMessage("");
    setUploadedFile(null);

    try {
      const response = await uploadDocument(selectedFile, setProgress);
      setUploadedFile(response.data);
      setSelectedFile(null);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Upload failed. Please check your connection and try again.";
      setErrorMessage(backendMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Clears the success result and brings the upload box back so the
  // user can pick a new file.
  const handleUploadAnother = () => {
    setUploadedFile(null);
    setSelectedFile(null);
    setErrorMessage("");
    setProgress(0);
  };

  return (
    <MainLayout title="Documents">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload a file to store it securely on the local server.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {uploadedFile ? (
            // ---- Compact success state -------------------------------
            // Replaces the upload box entirely while a result is shown,
            // so the card stays short instead of stacking both states.
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                Upload Successful
              </div>

              <div className="mt-2 ml-7">
                <p className="text-xs uppercase tracking-wide text-emerald-600/70">
                  File
                </p>
                <p className="truncate text-sm font-medium text-gray-900">
                  {uploadedFile.originalName}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUploadAnother}
                className="mt-3 ml-7 rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                Upload Another File
              </button>
            </div>
          ) : (
            // ---- Upload flow (unchanged behavior) --------------------
            <>
              <UploadBox onFilesSelected={handleFilesSelected} />

              {/* Selected file name, shown before upload starts */}
              {selectedFile && !isUploading && (
                <div className="mt-4">
                  <FileList files={[selectedFile]} onRemove={handleRemoveSelected} />
                </div>
              )}

              {/* Loading state while uploading */}
              {isUploading && (
                <div className="mt-4">
                  <UploadProgress
                    fileName={selectedFile?.name}
                    progress={progress}
                    status="uploading"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="mt-5 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Documents;