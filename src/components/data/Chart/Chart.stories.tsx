import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, BarChart, Sparkline } from './Chart';
import { Card, CardHeader, CardBody } from '../../core/Card';

const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 15 + i);
  const base = 1800 + Math.sin(i / 3) * 420 + i * 28;
  return { date: d, requests: Math.round(base), cached: Math.round(base * 0.62 + Math.cos(i / 2) * 90) };
});
const dateFmt = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' });
const xf = (v: unknown) => dateFmt.format(v as Date);

const meta = {
  title: 'Data/Chart',
  component: LineChart,
  subcomponents: { BarChart, Sparkline },
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Запросы за 30 дней', data: days, x: 'date', series: [{ key: 'requests', label: 'Запросы' }], xFormat: xf },
  decorators: [(S) => <div style={{ maxWidth: 720 }}><S /></div>],
} satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = { args: { area: true } };
export const MultiSeries: Story = { args: { series: [{ key: 'requests', label: 'Все запросы' }, { key: 'cached', label: 'Из кэша' }] } };
export const InCard: Story = {
  render: (args) => (
    <Card>
      <CardHeader title="Трафик" subtitle="Последние 30 дней" />
      <CardBody><LineChart {...args} area height={200} /></CardBody>
    </Card>
  ),
};
export const Bars: Story = {
  render: () => (
    <BarChart
      label="Деплои по дням недели"
      data={['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => ({ day: d, ok: [14, 22, 18, 25, 19, 4, 2][i], failed: [1, 3, 0, 2, 4, 0, 0][i] }))}
      x="day"
      series={[{ key: 'ok', label: 'Успешные' }, { key: 'failed', label: 'С ошибкой', color: 'var(--chart-5)' }]}
      height={220}
    />
  ),
};
export const SparklineKpi: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { t: 'Запросы', v: '58,2 тыс.', d: [3, 4, 3.5, 5, 4.8, 6, 6.4], c: 'var(--chart-1)' },
        { t: 'Ошибки', v: '0,4%', d: [5, 4, 4.5, 3, 3.2, 2.4, 2], c: 'var(--chart-2)' },
        { t: 'p95', v: '182 мс', d: [2, 2.4, 2.2, 3.1, 2.8, 3.4, 3.2], c: 'var(--chart-3)' },
      ].map((k) => (
        <Card key={k.t} style={{ width: 200 }}>
          <CardBody style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.t}</div><div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-strong)', marginTop: 4 }}>{k.v}</div></div>
            <Sparkline data={k.d} color={k.c} label={k.t + ': тренд за 7 дней'} width={72} />
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
