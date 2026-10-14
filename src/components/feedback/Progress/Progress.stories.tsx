import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Использовано минут сборки', value: 62, showValue: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'success', 'warning', 'danger', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Indeterminate: Story = { args: { value: undefined, label: 'Подготовка окружения', showValue: false } };
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Progress label="Хранилище" value={34} tone="success" showValue />
      <Progress label="Пропускная способность" value={78} tone="warning" showValue />
      <Progress label="Квота функций" value={97} tone="danger" showValue />
      <Progress value={3} max={8} size="sm" tone="neutral" label="Шаги" showValue={(v, m) => v + ' / ' + m} />
    </div>
  ),
};
