import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Minify the code for production
    minify: 'terser',
    terserOptions: {
      compress: {
        // This option removes all console logs from the production build
        drop_console: true,
      },
    },
  },
});
