import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Домен', placeholder: 'my-app', suffix: '.grain.dev', hint: 'Только латиница и дефис' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { label: undefined, icon: 'search', placeholder: 'Поиск проектов', suffix: undefined, hint: undefined } };
export const Invalid: Story = { args: { error: 'Домен уже занят', defaultValue: 'grain' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'grain-web' } };
