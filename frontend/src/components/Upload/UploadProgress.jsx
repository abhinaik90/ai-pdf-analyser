// src/components/Upload/UploadProgress.jsx
//
// Visual progress indicator for a single file. No actual upload logic
// lives here — the parent is expected to drive `progress` and `status`
// (e.g. from local state today, or from a real upload call later).

const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AlertCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const statusConfig = {
  uploading: {
    label: (progress) => `Uploading… ${progress}%`,
    barColor: "bg-indigo-600",
    textColor: "text-gray-600",
  },
  success: {
    label: () => "Upload complete",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-600",
  },
  error: {
    label: () => "Upload failed",
    barColor: "bg-red-500",
    textColor: "text-red-600",
  },
};

// `progress` is a number 0–100. `status` is "uploading" | "success" | "error".
const UploadProgress = ({ fileName, progress = 0, status = "uploading" }) => {
  const config = statusConfig[status] ?? statusConfig.uploading;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-gray-900">{fileName}</p>

        {status === "success" && (
          <CheckCircleIcon className="h-4.5 w-4.5 flex-shrink-0 text-emerald-500" />
        )}
        {status === "error" && (
          <AlertCircleIcon className="h-4.5 w-4.5 flex-shrink-0 text-red-500" />
        )}
      </div>

      {/* Progress track */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-200 ${config.barColor}`}
          style={{ width: `${status === "success" ? 100 : clampedProgress}%` }}
        />
      </div>

      <p className={`mt-2 text-xs ${config.textColor}`}>
        {config.label(clampedProgress)}
      </p>
    </div>
  );
};

export default UploadProgress;