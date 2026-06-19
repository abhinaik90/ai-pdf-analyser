// src/components/Layout/Header.jsx
//
// Top bar. Shows the current page title, the logged-in user's name
// (via useAuth()), and a logout button. On mobile, a hamburger button
// is shown to open the Sidebar (handled by MainLayout).

import { useAuth } from "../../context/AuthContext";

const MenuIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Builds initials from a full name, e.g. "Jane Doe" -> "JD".
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const Header = ({ title = "Dashboard", onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile-only menu button to open the Sidebar */}
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* User name + avatar (hidden on very small screens to save space) */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            {getInitials(user?.name)}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;