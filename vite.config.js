import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { DEV_SERVER_HOST, DEV_SERVER_PORT } from './vite.constants.js';

export default defineConfig({
  plugins: [react()],
  server: {
    host: DEV_SERVER_HOST,
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
