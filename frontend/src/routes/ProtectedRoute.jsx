// src/routes/ProtectedRoute.jsx
//
// Route guard for React Router v6+.
// Wrap any route/page that requires authentication with this component.
// It does NOT define the routes themselves (that happens later, in the
// router setup) — it only decides whether to render the protected
// content, redirect to /login, or show a loading state.

import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While AuthContext is still restoring the session from localStorage
  // (validating the token via getProfile), don't make a redirect
  // decision yet — doing so too early could incorrectly bounce an
  // already-logged-in user to /login.
  if (isLoading) {
    return <div style={styles.loadingWrapper}>Loading...</div>;
  }

  // Not authenticated — redirect to /login.
  // We pass the current location in `state.from` so that, after a
  // successful login, the app can navigate the user back to the page
  // they originally tried to visit (e.g. Login.jsx can read
  // `location.state?.from` and navigate there instead of /dashboard).
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated — render the protected content.
  // Supports two usage styles:
  //   1. <ProtectedRoute><Dashboard /></ProtectedRoute>   (children prop)
  //   2. <Route element={<ProtectedRoute />}><Route .../></Route> (nested routes via Outlet)
  return children ? children : <Outlet />;
};

const styles = {
  loadingWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default ProtectedRoute;