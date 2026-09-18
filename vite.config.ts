import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Library build and unit tests. Storybook uses its own config in .storybook/vite.config.ts.
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.build.json' })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@base-ui\/react($|\/)/,
        /^@phosphor-icons\/react($|\/)/,
      ],
      // The kit relies on context and hooks: mark the bundle as a client module for RSC frameworks.
      output: { banner: "'use client';" },
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
