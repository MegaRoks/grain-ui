import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Data/Avatar',
  component: Avatar,
  subcomponents: { AvatarGroup },
  tags: ['autodocs'],
  args: { name: 'Анна Петрова', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'busy', 'offline'] },
  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const WithStatus: Story = { args: { status: 'online', size: 'lg' } };
export const Palette: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {['Анна Петрова', 'Иван Смирнов', 'Ольга К', 'Марк Лебедев', 'Grain Bot'].map((n) => <Avatar key={n} name={n} />)}
    </div>
  ),
};
export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      {['Анна Петрова', 'Иван Смирнов', 'Ольга К', 'Марк Лебедев', 'Grain Bot'].map((n) => <Avatar key={n} name={n} />)}
    </AvatarGroup>
  ),
};
