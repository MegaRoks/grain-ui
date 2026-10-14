import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover, PopoverItem, PopoverSeparator } from './Popover';
import { Button } from '../../core/Button';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  subcomponents: { PopoverItem, PopoverSeparator },
  tags: ['autodocs'],
  args: { open: false, align: 'left', width: 220 },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    side: { control: 'inline-radio', options: ['bottom', 'top'] },
  },
  parameters: { layout: 'padded' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <div style={{ display: 'inline-block' }}>
        <Button iconEnd="chevron-down" onClick={() => setOpen((o) => !o)}>Действия</Button>
        <Popover {...args} open={open} onClose={() => setOpen(false)}>
          <PopoverItem icon="rotate-ccw" shortcut="⌘R">Передеплоить</PopoverItem>
          <PopoverItem icon="file-text" selected>Логи</PopoverItem>
          <PopoverSeparator />
          <PopoverItem icon="trash-2">Удалить</PopoverItem>
        </Popover>
      </div>
    );
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Меню внутри контейнера с overflow:hidden больше не обрезается — оно в портале. */
export const InsideOverflowHidden: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ overflow: 'hidden', height: 60, width: 240, padding: 12, borderRadius: 10, boxShadow: 'var(--hairline)' }}>
        <Button iconEnd="chevron-down" onClick={() => setOpen((o) => !o)}>Действия</Button>
        <Popover {...args} open={open} onClose={() => setOpen(false)} aria-label="Действия">
          <PopoverItem icon="rotate-ccw">Передеплоить</PopoverItem>
          <PopoverItem icon="file-text">Логи</PopoverItem>
          <PopoverItem icon="trash-2">Удалить</PopoverItem>
        </Popover>
      </div>
    );
  },
};
