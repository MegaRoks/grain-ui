import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Уведомления о сборке' },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] } },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={(e) => setOn(e.target.checked)} />;
  },
};
export const Large: Story = { ...Controlled, args: { size: 'lg' } };
