import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items: [{ value: 'all', label: 'Все', count: 24 }, { value: 'prod', label: 'Production', count: 3 }, { value: 'preview', label: 'Превью', count: 21 }] },
  argTypes: { variant: { control: 'inline-radio', options: ['segmented', 'underline'] } },
  render: (args) => {
    const [v, setV] = useState(args.value ?? 'all');
    return <Tabs {...args} value={v} onChange={setV} />;
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Segmented: Story = {};
export const Underline: Story = { args: { variant: 'underline', items: ['Обзор', 'Деплои', 'Логи', 'Настройки'], value: 'Обзор' } };
