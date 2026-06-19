// src/main.jsx
//
// Entry point. Wraps the entire App in:
//   1. BrowserRouter  — enables React Router v6+ throughout the app
//   2. AuthProvider   — makes useAuth()/AuthContext available everywhere
//
// If your existing main.jsx imports global CSS (e.g. "./index.css"),
// keep that import — it's omitted here only because the original
// file content wasn't available to merge against.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);