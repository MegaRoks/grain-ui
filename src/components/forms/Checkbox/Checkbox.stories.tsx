import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Автодеплой из main', description: 'Каждый push запускает production-сборку' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(true);
    return <Checkbox {...args} checked={on} onChange={(e) => setOn(e.target.checked)} />;
  },
};
export const Disabled: Story = { args: { disabled: true, checked: false, readOnly: true } };
