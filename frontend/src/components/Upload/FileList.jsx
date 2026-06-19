// src/components/Upload/FileList.jsx
//
// Renders the list of selected files: name, human-readable size,
// and a remove button per row. Pure presentational — the parent owns
// the actual array of files and is responsible for removing an item
// from its own state when `onRemove` fires.

const FileIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
  </svg>
);

const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

// Converts a byte count into a readable string, e.g. 1532 -> "1.5 KB".
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

// `files` is expected to be an array of either raw browser File objects
// or plain objects shaped like { id, name, size }.
const FileList = ({ files = [], onRemove }) => {
  if (files.length === 0) {
    return (
      <p className="text-sm text-gray-400">No files selected yet.</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
      {files.map((file, index) => {
        const key = file.id ?? `${file.name}-${index}`;

        return (
          <li
            key={key}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileIcon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemove?.(file.id ?? index)}
              className="flex-shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${file.name}`}
              title="Remove"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;