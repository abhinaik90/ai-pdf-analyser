// src/services/api.js
//
// Centralized Axios instance for the entire frontend application.
// Every other service file (authService.js, future pdfService.js, chatService.js, etc.)
// should import this instance instead of creating its own Axios calls.
// This keeps base URL, headers, and timeout configuration in ONE place.
 
import axios from "axios";
 
// Base URL of the backend API.
// In a real company setup this would come from an environment variable
// (e.g. import.meta.env.VITE_API_BASE_URL for Vite), but per the current
// requirement we hardcode it to the local backend.
const BASE_URL = "http://localhost:5000/api";
 
// Create a single, reusable Axios instance with shared configuration.
const api = axios.create({
  baseURL: BASE_URL,
 
  // Fail fast if the backend doesn't respond within 10 seconds.
  timeout: 10000,
 
  // Default headers applied to every request made with this instance.
  headers: {
    "Content-Type": "application/json", // We send JSON request bodies
    Accept: "application/json",         // We expect JSON response bodies
  },
});
 
// ---------------------------------------------------------------------
// Response Interceptor
// ---------------------------------------------------------------------
// Centralizes basic error handling so individual service functions don't
// need to repeat try/catch boilerplate for common cases.
api.interceptors.response.use(
  // Any status code in the 2xx range lands here — just pass it through.
  (response) => response,
 
  // Any other status code (4xx, 5xx) or network error lands here.
  (error) => {
    if (error.response) {
      // Backend responded, but with an error status (400, 401, 500, etc.)
      console.error(
        `API Error [${error.response.status}]:`,
        error.response.data?.message || error.response.data
      );
    } else if (error.request) {
      // Request was sent but no response was received (server down, timeout, etc.)
      console.error("API Error: No response received from server.");
    } else {
      // Something went wrong while setting up the request itself.
      console.error("API Error:", error.message);
    }
 
    // Re-throw so the calling code (e.g. authService.js) can still
    // handle the error in a way that's specific to that call.
    return Promise.reject(error);
  }
);
 
export default api;