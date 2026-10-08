import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { IconButton } from '../../core/IconButton';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Поиск', shortcut: '⌘K', side: 'top', delay: 400, children: null },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 4 }}>
      <Tooltip {...args}><IconButton icon="search" label="Поиск" /></Tooltip>
      <Tooltip {...args} content="Настройки" shortcut={undefined}><IconButton icon="settings" label="Настройки" /></Tooltip>
      <Tooltip {...args} content="Помощь" shortcut="?"><IconButton icon="circle-help" label="Помощь" /></Tooltip>
    </div>
  ),
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
