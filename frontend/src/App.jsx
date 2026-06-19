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
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./index.css";


// ---------------------------------------------------------------------
// Temporary Dashboard placeholder.
// Only shows: a welcome message, the logged-in user's name, and a
// logout button wired to AuthContext's logout().
// ---------------------------------------------------------------------
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={dashboardStyles.wrapper}>
      <div style={dashboardStyles.card}>
        <h1 style={dashboardStyles.heading}>Welcome{user?.name ? `, ${user.name}` : ""} 👋</h1>
        <p style={dashboardStyles.subtext}>You are logged in to Private PDF AI Assistant.</p>
        <button onClick={logout} style={dashboardStyles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const dashboardStyles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    padding: "32px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  heading: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
    color: "#1f2329",
  },
  subtext: {
    margin: "10px 0 24px",
    fontSize: "14px",
    color: "#6b7280",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#dc2626",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

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

      {/* Default route: send users straight to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all: unknown paths also go to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;