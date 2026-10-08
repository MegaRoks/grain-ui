import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tag } from './Tag';

const meta = {
  title: 'Core/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'production', icon: 'globe' },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Removable: Story = { args: { onRemove: fn() } };
