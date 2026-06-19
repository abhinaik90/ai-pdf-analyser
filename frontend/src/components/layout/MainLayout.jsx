// src/components/Layout/MainLayout.jsx
//
// Shell that combines Sidebar (left), Header (top), and a scrollable
// main content area. Pages (like Dashboard.jsx) render their content
// as `children` and optionally pass a `title` for the Header.
//
// Owns the open/closed state of the mobile sidebar so Header's
// hamburger button and Sidebar's backdrop/close stay in sync.

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;