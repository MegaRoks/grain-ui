import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BottomNav } from './BottomNav';

const meta = {
  title: 'Navigation/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    position: 'static',
    value: 'home',
    items: [
      { value: 'home', label: 'Главная', icon: 'house' },
      { value: 'stats', label: 'Статистика', icon: 'chart-column' },
      { value: 'add', label: 'Добавить', icon: 'circle-plus' },
      { value: 'inbox', label: 'Входящие', icon: 'bell', badge: 3 },
      { value: 'me', label: 'Профиль', icon: 'user', badge: true },
    ],
  },
  argTypes: { position: { control: 'inline-radio', options: ['static', 'fixed'] } },
  render: (args) => {
    const [v, setV] = useState(args.value);
    return <div style={{ width: 390 }}><BottomNav {...args} value={v} onChange={setV} /></div>;
  },
} satisfies Meta<typeof BottomNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ThreeItems: Story = { args: { items: [{ value: 'home', label: 'Сегодня', icon: 'sun' }, { value: 'stats', label: 'Динамика', icon: 'chart-line' }, { value: 'me', label: 'Настройки', icon: 'settings' }] } };
