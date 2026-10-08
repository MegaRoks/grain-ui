import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { IconButton } from './IconButton';

const meta = {
  title: 'Core/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: 'settings', label: 'Настройки', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'outline', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Solid: Story = { args: { variant: 'solid', icon: 'plus', label: 'Добавить' } };
export const Pressed: Story = { args: { pressed: true, icon: 'pin', label: 'Закрепить' } };
