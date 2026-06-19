// src/services/authService.js
//
// Authentication-related API calls.
// This file does NOT manage React state or context — it only talks to the backend.
// AuthContext (a later step) will call these functions and decide what to do
// with the returned data (e.g. store the token, update global auth state).
 
import api from "./api";
 
/**
 * Register a new user.
 *
 * @param {Object} userData - e.g. { name, email, password }
 * @returns {Promise<Object>} The backend response data (e.g. created user / token).
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    // Bubble the error up to whoever called register(),
    // so the UI layer can show an appropriate message.
    throw error;
  }
};
 
/**
 * Log in an existing user.
 *
 * @param {Object} credentials - e.g. { email, password }
 * @returns {Promise<Object>} The backend response data (e.g. token + user info).
 */
export const login = async (credentials) => {
  try {
   const response = await api.post("/auth/login", credentials);

console.log("LOGIN RESPONSE:", response.data);

return response.data;
  } catch (error) {
    throw error;
  }
};
 
/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid JWT obtained from login().
 *
 * @param {string} token - JWT access token.
 * @returns {Promise<Object>} The backend response data (user profile).
 */
export const getProfile = async (token) => {
  try {
    const response = await api.get("/auth/profile", {
      headers: {
        // Attach the token only for this specific request.
        // (We don't add it globally in api.js because not every
        // request needs authentication, e.g. register/login.)
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
// Grouping as a default export too, in case some files prefer
// importing the whole service object instead of named functions.
export default {
  register,
  login,
  getProfile,
};