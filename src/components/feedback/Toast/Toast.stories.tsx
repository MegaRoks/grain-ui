import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast, Toaster, type ToastItem } from './Toast';
import { Button } from '../../core/Button';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  subcomponents: { Toaster },
  tags: ['autodocs'],
  args: { title: 'Деплой завершён', description: 'grain-web · production · 42 с', tone: 'success' },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error', 'loading'] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { decorators: [(S) => <div style={{ width: 360 }}><S /></div>] };
export const Stack: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const push = () => setToasts((t) => [{ id: Date.now(), title: 'Сборка #' + (t.length + 1), tone: 'loading' }, ...t]);
    return (
      <div style={{ height: '100vh', padding: 24 }}>
        <Button variant="solid" onClick={push}>Показать тост</Button>
        <Toaster toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      </div>
    );
  },
};
