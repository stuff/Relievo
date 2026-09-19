import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Library build and unit tests. Storybook uses its own config in .storybook/vite.config.ts.
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.build.json' })],
  build: {
    lib: {
      // Two files: client.js holds the kit and is marked 'use client'; index.js, the package entry,
      // has no directive so that compound components keep their dot notation in Server
      // Components (see src/index.tsx).
      entry: { index: 'src/index.tsx', client: 'src/client.ts' },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@base-ui\/react($|\/)/,
        /^@phosphor-icons\/react($|\/)/,
        /^@fontsource-variable\//,
      ],
      // The kit relies on context and hooks: every file but index.js is a client module for RSC
      // frameworks. Rolldown moves the shared code into a hashed chunk that index.js imports
      // directly, so the directive goes on every chunk, not only on client.js.
      output: { banner: (chunk) => (chunk.fileName === 'index.js' ? '' : "'use client';") },
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
