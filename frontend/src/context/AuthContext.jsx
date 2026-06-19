// src/context/AuthContext.jsx
//
// Global authentication state management using React Context API.
// Responsibilities of this file ONLY:
//   - Hold the current user + JWT token in memory (React state)
//   - Persist/restore the token via localStorage
//   - Expose login() / logout() actions
//   - Expose isAuthenticated, user, token to the rest of the app
//
// It does NOT render any UI (no login form, no routes) — those come later
// and will simply call useAuth() to get what they need.

import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, getProfile } from "../services/authService";

// Key used to persist the JWT in localStorage between page reloads.
const TOKEN_STORAGE_KEY = "auth_token";

// 1. Create the context.
// Default value is only used if a component reads it WITHOUT being
// wrapped in <AuthProvider>, so we give safe no-op defaults.
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

// 2. AuthProvider — wraps the app and owns the actual state.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Tracks whether we're still trying to restore a session from
  // localStorage on first load (useful later to show a loading screen
  // instead of flashing a "logged out" state).
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------
  // On app startup: try to restore the session from localStorage.
  // ---------------------------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate the token by fetching the user's profile with it.
        const profileResponse = await getProfile(storedToken);

setToken(storedToken);
setUser(profileResponse.data.user);
      } catch (error) {
        // Token is invalid/expired — clear it so we don't keep retrying.
        console.error("Failed to restore session:", error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ---------------------------------------------------------------
  // login(credentials) — authenticate, store token, fetch profile.
  // ---------------------------------------------------------------
  const login = async (credentials) => {
    // 1. Authenticate against the backend.
   const loginData = await loginService(credentials);
const receivedToken = loginData.data.token;

    // 2. Persist the token so the session survives a page reload.
    localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    setToken(receivedToken);

    // 3. Fetch the full user profile using the new token.
    const profileResponse = await getProfile(receivedToken);
setUser(profileResponse.data.user);

    // Returned in case the caller (e.g. a future Login page) wants
    // to act on the result directly (e.g. redirect).
    return profileResponse.data.user;
  };

  // ---------------------------------------------------------------
  // logout() — clear everything, both in memory and in localStorage.
  // ---------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  // Derived flag: we consider the user authenticated only if we
  // have BOTH a token and a loaded user profile.
  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. useAuth — custom hook so consumers don't import useContext + AuthContext
// everywhere; they just call useAuth() inside any component.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // Helps catch the mistake of using useAuth() outside <AuthProvider>.
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;