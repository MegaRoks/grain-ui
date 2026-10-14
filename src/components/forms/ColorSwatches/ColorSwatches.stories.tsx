import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColorSwatches } from './ColorSwatches';

const PALETTE = [
  { value: 'blue', color: '#2F6BFF', label: 'Синий' },
  { value: 'green', color: '#12A150', label: 'Зелёный' },
  { value: 'amber', color: '#D99100', label: 'Янтарь' },
  { value: 'red', color: '#DC3B43', label: 'Красный' },
  { value: 'violet', color: '#7A5AF8', label: 'Фиолетовый' },
  { value: 'mint', color: '#BFF0D4', label: 'Мята' },
  { value: 'sand', color: '#F1E4C8', label: 'Песок' },
  { value: 'graphite', color: '#33332F', label: 'Графит' },
];

const meta = {
  title: 'Forms/ColorSwatches',
  component: ColorSwatches,
  tags: ['autodocs'],
  args: { label: 'Цвет категории', options: PALETTE },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => {
    const [v, setV] = useState('blue');
    return <div style={{ width: 300 }}><ColorSwatches {...args} value={v} onChange={setV} /></div>;
  },
} satisfies Meta<typeof ColorSwatches>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg', options: PALETTE.slice(0, 5) } };
export const ChartTokens: Story = {
  args: { label: 'Цвет серии', options: [1, 2, 3, 4, 5].map((n) => ({ value: 'c' + n, color: 'var(--chart-' + n + ')', label: 'Цвет ' + n })) },
  render: (args) => { const [v, setV] = useState('c1'); return <ColorSwatches {...args} value={v} onChange={setV} />; },
};
export const Disabled: Story = { args: { disabled: true } };
