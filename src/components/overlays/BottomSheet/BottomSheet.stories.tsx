import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../../core/Button';
import { Switch } from '../../forms/Switch';
import { Tabs } from '../../navigation/Tabs';

const meta = {
  title: 'Overlays/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered', viewport: { defaultViewport: 'mobile1' } },
  args: { open: false, title: 'Фильтры', description: 'Применятся ко всем графикам на экране' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    const [period, setPeriod] = useState('week');
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть шторку</Button>
        <BottomSheet
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={<><Button onClick={() => setOpen(false)}>Сбросить</Button><Button variant="solid" onClick={() => setOpen(false)}>Применить</Button></>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Tabs items={[{ value: 'day', label: 'День' }, { value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' }]} value={period} onChange={setPeriod} aria-label="Период" />
            <Switch label="Только рабочие дни" defaultChecked />
            <Switch label="Сравнить с прошлым периодом" />
          </div>
        </BottomSheet>
      </>
    );
  },
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Потяните за ручку вниз: короткий жест возвращает шторку, длинный или резкий — закрывает. */
export const Default: Story = {};
export const LongContent: Story = {
  args: { title: 'Все категории', description: undefined },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть</Button>
        <BottomSheet {...args} open={open} onClose={() => setOpen(false)}>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} style={{ padding: '12px 0', boxShadow: 'inset 0 -1px 0 var(--border-subtle)', fontSize: 14 }}>Категория {i + 1}</div>
          ))}
        </BottomSheet>
      </>
    );
  },
};
