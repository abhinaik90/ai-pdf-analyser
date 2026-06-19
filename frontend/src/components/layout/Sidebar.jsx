// src/components/Layout/Sidebar.jsx
//
// Left-hand navigation. On desktop it's a fixed static column.
// On mobile it becomes a slide-over panel controlled by `isOpen`/`onClose`,
// with a dimmed backdrop behind it.
//
// "Documents" and "Chat" are intentionally disabled placeholders —
// those features don't exist yet (per the brief: no upload, no chat).

import { NavLink } from "react-router-dom";

// --- Small inline icons (no external icon library required) ---------
const LockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);

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

const navItems = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon, disabled: false },
  { name: "Documents", to: "/documents", icon: FileIcon, disabled: false },
  { name: "Chat", to: "#", icon: ChatIcon, disabled: true },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop — only visible while the sidebar is open on small screens */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
          <LockIcon className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide text-white">
            PDF AI Assistant
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ name, to, icon: Icon, disabled }) =>
            disabled ? (
              <div
                key={name}
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-500"
                title="Coming soon"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  {name}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                  Soon
                </span>
              </div>
            ) : (
              <NavLink
                key={name}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                {name}
              </NavLink>
            )
          )}
        </nav>

        {/* Footer note */}
        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          Documents are processed locally.
        </div>
      </aside>
    </>
  );
};

export default Sidebar;