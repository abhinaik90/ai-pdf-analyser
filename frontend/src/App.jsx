// src/App.jsx
//
// Top-level route definitions for the app.
// AuthProvider and BrowserRouter are set up in main.jsx (see below),
// so this file only needs to declare WHERE each page lives.
//
// NOTE: Dashboard below is a TEMPORARY inline placeholder, as requested,
// since a real Dashboard page does not exist yet. It will be replaced by
// a proper src/pages/Dashboard.jsx in a later step.

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import ProtectedRoute from "./routes/ProtectedRoute";

// ---------------------------------------------------------------------
// App — route table.
// ---------------------------------------------------------------------
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected route — only reachable when authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      {/* Default route: send users straight to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all: unknown paths also go to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;