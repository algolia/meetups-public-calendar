import { defineConfig } from 'vite';
import config from 'aberlaas/configs/vite';

/* eslint-disable import/no-unresolved */
// Those plugins uses the .exports syntax in their package.json, which isn't yet
// supported by eslint-plugin-import
import vitePluginReact from '@vitejs/plugin-react';
/* eslint-enable import/no-unresolved */

export default defineConfig({
  ...config,
  plugins: [vitePluginReact()],
  root: '.',
  build: {
    outDir: 'dist',
  },
});
