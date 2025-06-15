
// import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { componentTagger } from "lovable-tagger";

import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/dark-blog-wheel/", // Исправлено (был полный URL, теперь относительный путь)
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
    },
    server: {
      host: "::",
      port: 8080,
    },
    // logLevel: mode === 'production' ? 'silent' : 'warn',
    // clearScreen: mode === 'production',
    plugins: [
      react(),
      tsconfigPaths(),
      mode === 'development' && componentTagger()
    ].filter(Boolean),
    build: {
      outDir: './docs',
      assetsInlineLimit: 1024, // Ресурсы меньшего размера будут встроены как base64
      sourcemap: false,
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },

  }
})
