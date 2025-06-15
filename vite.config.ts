// import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { componentTagger } from "lovable-tagger";

import { version } from './package.json';

import { resolve } from "path";

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
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          library: resolve(__dirname, 'docs/library.html'),
          sport: resolve(__dirname, 'docs/sport.html'),
        },
        output: {
          manualChunks(id) {
            // Вынеси react, react-dom, shadcn/ui и lucide-react в отдельный chunk для кэширования
            if (
              /[\\/]node_modules[\\/](react|react-dom|@radix-ui|clsx|lucide-react)/.test(id) ||
              /[\\/]src[\\/]components[\\/]/.test(id)
            ) {
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  }
})
