// src/components/Upload/UploadBox.jsx
//
// Drag-and-drop + click-to-select file picker.
// Pure UI — no axios, no upload logic. It just collects File objects
// from the browser and hands them to the parent via `onFilesSelected`.
// The parent page decides what to do with them (store in state, later
// wire up an actual upload call, etc.).

import { useState, useRef } from "react";

const UploadCloudIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M7 18a4.5 4.5 0 0 1-1.2-8.84A6 6 0 0 1 17.6 7.4 4.5 4.5 0 0 1 17 18" />
    <path d="M12 12v7" />
    <path d="M9 15l3-3 3 3" />
  </svg>
);

const UploadBox = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Forward whatever files were picked/dropped to the parent.
  const emitFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length > 0) {
      onFilesSelected?.(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    emitFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    emitFiles(e.target.files);
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openFileDialog}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors cursor-pointer
        ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50"
        }`}
    >
      {/* Hidden native input — accepts ALL file types, no restriction */}
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isDragging ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        <UploadCloudIcon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900">
          {isDragging ? "Drop files here" : "Drag and drop files here"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          or <span className="font-medium text-indigo-600">click to browse</span> from your computer
        </p>
      </div>
    </div>
  );
};

export default UploadBox;