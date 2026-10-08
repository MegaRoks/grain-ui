import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Задеплоить', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'accent', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};
export const Solid: Story = { args: { variant: 'solid', iconStart: 'rocket' } };
export const Accent: Story = { args: { variant: 'accent' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Удалить проект' } };
export const Loading: Story = { args: { variant: 'solid', loading: true, children: 'Сборка…' } };
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['solid', 'accent', 'secondary', 'ghost', 'danger'] as const).map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}
    </div>
  ),
};
export const ClickTest: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
