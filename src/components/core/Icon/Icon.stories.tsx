import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Core/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'rocket', size: 16, strokeWidth: 1.75 },
  argTypes: { size: { control: { type: 'range', min: 12, max: 32, step: 1 } } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Set: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      {['rocket', 'git-branch', 'globe', 'settings', 'search', 'circle-check', 'triangle-alert', 'x'].map((n) => (
        <Icon key={n} {...args} name={n} />
      ))}
    </div>
  ),
};
