import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Tests only. Phosphor's barrel (`@phosphor-icons/react`) pulls in about 3000 modules and costs
// about 2 s to load in every (isolated) test file. Rewrite named imports from it into imports of
// the one module each icon lives in.
const phosphorBarrel = /import\s*\{([^}]*)\}\s*from\s*'@phosphor-icons\/react'\s*;?/g;

function phosphorPerIcon(): Plugin {
  return {
    name: 'relievo:phosphor-per-icon',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules') || !code.includes("'@phosphor-icons/react'")) return null;
      return code.replace(phosphorBarrel, (_match, names: string) =>
        names
          .split(',')
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => {
            if (name.startsWith('type ')) return '';
            const source =
              name === 'IconContext'
                ? '@phosphor-icons/react/dist/lib/context'
                : `@phosphor-icons/react/dist/csr/${name.replace(/Icon$/, '')}`;
            return `import { ${name} } from '${source}';`;
          })
          .join('\n'),
      );
    },
  };
}

// Library build and unit tests. Storybook uses its own config in .storybook/vite.config.ts.
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({ tsconfigPath: './tsconfig.build.json' }),
    mode === 'test' ? phosphorPerIcon() : null,
  ],
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
}));
