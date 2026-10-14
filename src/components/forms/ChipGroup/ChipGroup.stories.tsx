import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ChipGroup } from './ChipGroup';

const CATEGORIES = [
  { value: 'food', label: 'Еда', icon: 'utensils', count: 42 },
  { value: 'transport', label: 'Транспорт', icon: 'bus', count: 18 },
  { value: 'home', label: 'Дом', icon: 'house', count: 9 },
  { value: 'fun', label: 'Развлечения', icon: 'popcorn', count: 14 },
  { value: 'health', label: 'Здоровье', icon: 'heart-pulse', count: 3 },
  { value: 'other', label: 'Другое', count: 0, disabled: true },
];

const meta = {
  title: 'Forms/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs'],
  args: { label: 'Категории', options: CATEGORIES },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    overflow: { control: 'inline-radio', options: ['wrap', 'scroll'] },
  },
  // value/defaultValue/onChange из args не пробрасываем: их тип зависит от multiple.
  render: ({ multiple: _m, value: _v, defaultValue: _d, onChange: _c, ...args }) => {
    const [v, setV] = useState<string[]>(['food', 'home']);
    return <div style={{ width: 420 }}><ChipGroup {...args} multiple value={v} onChange={setV} /></div>;
  },
} satisfies Meta<typeof ChipGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleFilters: Story = {};
export const SingleChoice: Story = {
  render: () => {
    const [v, setV] = useState('week');
    return (
      <ChipGroup label="Период" multiple={false} value={v} onChange={setV}
        options={[{ value: 'day', label: 'День' }, { value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' }, { value: 'year', label: 'Год' }]} />
    );
  },
};
/** Мобильный ряд фильтров: одна строка, прокрутка пальцем, края уходят под поля экрана. */
export const MobileScroll: Story = {
  args: { overflow: 'scroll', size: 'sm', label: undefined, 'aria-label': 'Фильтры' },
  render: ({ multiple: _m, value: _v, defaultValue: _d, onChange: _c, ...args }) => {
    const [v, setV] = useState<string[]>([]);
    return <div style={{ width: 360, padding: '0 16px', overflow: 'hidden' }}><ChipGroup {...args} multiple value={v} onChange={setV} /></div>;
  },
};
