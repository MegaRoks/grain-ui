import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Регион', options: [{ value: 'fra', label: 'Франкфурт' }, { value: 'ams', label: 'Амстердам' }, { value: 'hel', label: 'Хельсинки' }] },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(S) => <div style={{ width: 280 }}><S /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StringOptions: Story = { args: { label: 'Ветка', options: ['main', 'develop', 'release'] } };
