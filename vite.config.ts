/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    dts({ entryRoot: 'src', include: ['src'], exclude: ['**/*.stories.tsx', '**/*.test.tsx'] }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'] },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: { include: ['src/**/*.tsx'], exclude: ['**/*.stories.tsx'] },
  },
});
