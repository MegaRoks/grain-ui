import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = { render: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Spinner size="sm" /><Spinner /><Spinner size="lg" /></div> };
export const Inline: Story = { render: () => <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}><Spinner size="sm" label="" />Собираем превью…</span> };
