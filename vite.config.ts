import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { unstopSyncPlugin } from './vite-plugin-unstop-sync';

export default defineConfig({
  plugins: [
    react(),
    // unstopSyncPlugin() // Temporarily disabled Unstop fetching
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
