/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** В library mode Vite инлайнит все ассеты в base64, поэтому шрифты не идут через бандл:
 *  fonts.css копируется в dist без обработки, а @fontsource разрешает бандлер приложения. */
function copyFontsCss(): Plugin {
  return {
    name: 'grain-copy-fonts-css',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'fonts.css', source: readFileSync(fileURLToPath(new URL('./src/styles/fonts.css', import.meta.url)), 'utf8') });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({ entryRoot: 'src', include: ['src'], exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.test.ts'] }),
    copyFontsCss(),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', /^lucide-react/] },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: { include: ['src/**/*.{ts,tsx}'], exclude: ['**/*.stories.tsx', '**/*.test.*'] },
  },
});
