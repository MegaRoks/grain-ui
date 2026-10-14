import type { Preview } from '@storybook/react';
import { icons } from 'lucide-react';
import '../src/styles/fonts.css';
import '../src/styles/index.css';
import { registerIcons } from '../src/components/core/Icon';

// Storybook only: register the whole Lucide set so stories can use icon="rocket".
// In apps, register just the icons you need.
registerIcons(icons);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, ctx) => {
      document.documentElement.dataset.theme = ctx.globals.theme as string;
      document.body.style.background = 'var(--bg-page)';
      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    options: { storySort: { order: ['Введение', 'Foundations', 'Layout', 'Core', 'Forms', 'Navigation', 'Data', 'Overlays', 'Feedback', 'Patterns'] } },
  },
};

export default preview;
