import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // vite.config.ts is set up for the library build; drop lib mode and d.ts generation for Storybook
  viteFinal: (config) => ({
    ...config,
    plugins: config.plugins?.flat().filter((p) => !(p && 'name' in p && p.name === 'vite:dts')),
    build: { ...config.build, lib: false },
  }),
};

export default config;
