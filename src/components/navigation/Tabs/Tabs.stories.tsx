import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs, TabPanel } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: { TabPanel },
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
export const WithPanels: Story = {
  args: { id: 'project', variant: 'underline', 'aria-label': 'Разделы проекта', items: ['Обзор', 'Деплои', 'Логи'] },
  render: (args) => {
    const [v, setV] = useState('Обзор');
    return (
      <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Tabs {...args} value={v} onChange={setV} />
        {['Обзор', 'Деплои', 'Логи'].map((t) => (
          <TabPanel key={t} tabsId="project" value={t} hidden={v !== t}>Содержимое раздела «{t}»</TabPanel>
        ))}
      </div>
    );
  },
};
