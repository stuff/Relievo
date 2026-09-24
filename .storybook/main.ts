import type { StorybookConfig } from '@storybook/react-vite';

// Inherited props (from Base UI or HTML) shown in the docs API table. All other inherited
// props are hidden: the table documents our API, not the ~300 DOM attributes.
const inheritedPropsToDocument = new Set(['children', 'disabled', 'focusableWhenDisabled']);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
  typescript: {
    // Uses the TypeScript compiler, so union props (Button as button or link) and
    // inherited props are resolved. The default react-docgen finds no Button props.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: './tsconfig.json',
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      skipChildrenPropWithoutDoc: false,
      propFilter: (prop) => {
        const declaredInNodeModules =
          prop.declarations?.every((declaration) =>
            declaration.fileName.includes('node_modules'),
          ) ?? false;
        return !declaredInNodeModules || inheritedPropsToDocument.has(prop.name);
      },
    },
  },
};

export default config;
