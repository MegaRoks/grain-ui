import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Готово', tone: 'success', dot: true },
  argTypes: { tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'solid'] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge>Черновик</Badge>
      <Badge tone="accent">Превью</Badge>
      <Badge tone="success" dot>Готово</Badge>
      <Badge tone="warning" dot>Сборка</Badge>
      <Badge tone="danger" dot>Ошибка</Badge>
      <Badge tone="solid">Prod</Badge>
    </div>
  ),
};
