// Vite configuration for React client
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Enable React plugin
  server: {
    port: 5173, // Run on port 5173
  },
});