import { defineConfig } from 'vite';
import config from 'aberlaas/configs/vite';

// @vitejs/plugin-react uses the exports syntax in its package.json, which
// eslint-plugin-import doesn't support
// eslint-disable-next-line import/no-unresolved
import vitePluginReact from '@vitejs/plugin-react';

export default defineConfig({
  ...config,
  plugins: [vitePluginReact()],
  root: '.',
  build: {
    outDir: 'dist',
  },
});
