import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../../core/Button';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { open: false, title: 'Удалить проект?', description: 'grain-web и все его деплои будут удалены без возможности восстановления.' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Удалить</Button>
        <Dialog {...args} open={open} onClose={() => setOpen(false)}
          footer={<><Button onClick={() => setOpen(false)}>Отмена</Button><Button variant="danger" onClick={() => setOpen(false)}>Удалить</Button></>} />
      </>
    );
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OpenByDefault: Story = { args: { open: true } };
