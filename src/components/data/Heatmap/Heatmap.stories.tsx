import type { Meta, StoryObj } from '@storybook/react';
import { Heatmap, CalendarHeatmap } from './Heatmap';
import { Card, CardHeader, CardBody } from '../../core/Card';

const hours = Array.from({ length: 24 }, (_, h) => (h % 3 === 0 ? String(h) : ''));
const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const byHour = week.map((_, d) => Array.from({ length: 24 }, (_, h) => {
  const work = d < 5 && h >= 9 && h <= 19 ? 1 : 0.25;
  return Math.round((Math.sin(h / 3.8) + 1.2) * 20 * work + (d === 2 && h === 14 ? 30 : 0));
}));
const today = new Date(2026, 9, 14);
const days = Array.from({ length: 182 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - 181 + i);
  const wk = (d.getDay() + 6) % 7;
  return { date: d, value: Math.max(0, Math.round(Math.sin(i / 9) * 3 + (wk < 5 ? 3 : 0) + ((i * 7919) % 5) - 2)) };
});

const meta = {
  title: 'Data/Heatmap',
  component: Heatmap,
  subcomponents: { CalendarHeatmap },
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Запросы по часам и дням недели', values: byHour, rowLabels: week, colLabels: hours, cellLabel: (v, r, c) => week[r] + ', ' + c + ':00 — ' + v + ' запр.' },
  argTypes: { levels: { control: { type: 'range', min: 2, max: 8 } } },
  decorators: [(S) => <div style={{ maxWidth: 720 }}><S /></div>],
} satisfies Meta<typeof Heatmap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HoursByWeekday: Story = {};
export const CustomColor: Story = { args: { color: 'var(--chart-2)', levels: 5 } };
export const Calendar: Story = {
  render: () => (
    <Card>
      <CardHeader title="Активность" subtitle="Последние полгода" />
      <CardBody><CalendarHeatmap label="Активность за полгода" days={days} dayLabel={(d, v) => d.toLocaleDateString('ru', { day: 'numeric', month: 'long' }) + ' — ' + (v ?? 0) + ' событий'} /></CardBody>
    </Card>
  ),
};
