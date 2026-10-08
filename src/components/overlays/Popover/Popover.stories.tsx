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
  argTypes: { align: { control: 'inline-radio', options: ['left', 'right'] } },
  parameters: { layout: 'padded' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 200 }}>
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
