// src/pages/Dashboard.jsx
//
// Dashboard page content. Layout (sidebar/header/scroll area) is handled
// entirely by MainLayout — this file only supplies what goes inside it.
// No API calls here; "Documents" and "Chat" are static placeholders
// for now, per the brief.

import MainLayout from "../components/Layout/MainLayout";
import { useAuth } from "../context/AuthContext";

const FileIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
  </svg>
);

const ChatIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M21 12a8 8 0 1 1-3.2-6.4" />
    <path d="M21 3v6h-6" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />
  </svg>
);

// Static placeholder cards — purely visual, no backend calls.
const cards = [
  {
    title: "Documents",
    description: "Upload and manage your confidential PDFs.",
    icon: FileIcon,
    status: "Coming soon",
  },
  {
    title: "Chat",
    description: "Ask questions about your uploaded documents.",
    icon: ChatIcon,
    status: "Coming soon",
  },
  {
    title: "Privacy",
    description: "All processing runs locally — nothing leaves your machine.",
    icon: ShieldIcon,
    status: "Active",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your private workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, description, icon: Icon, status }) => (
          <div
            key={title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  status === "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Dashboard;