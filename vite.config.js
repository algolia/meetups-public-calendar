import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from 'aberlaas/configs/vite';

export default defineConfig({
  ...config,
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
  },
});
