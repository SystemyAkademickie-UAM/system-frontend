import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { DEV_SERVER_HOST, DEV_SERVER_PORT } from './vite.constants.js';

function resolveNodeEnv(mode) {
  if (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.trim().length > 0) {
    return process.env.NODE_ENV.trim();
  }
  return mode === 'production' ? 'production' : 'development';
}

export default defineConfig(({ mode }) => ({
  appType: 'spa',
  plugins: [react()],
  define: {
    'import.meta.env.NODE_ENV': JSON.stringify(resolveNodeEnv(mode)),
  },
  server: {
    host: DEV_SERVER_HOST,
    port: DEV_SERVER_PORT,
    strictPort: true,
    proxy: {
      // `/api/` — tylko wywołania REST; nie przechwytuj `/api-test` (strona dev SPA).
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
  },
}));
