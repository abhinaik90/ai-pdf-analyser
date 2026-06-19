// vite.config.js
// WHY THIS FILE EXISTS:
// Vite needs this file to know how to build/serve our React app.
// We also set up a dev server proxy so the frontend can call `/api/...`
// and Vite forwards those requests to our backend, avoiding CORS issues
// during local development.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
