import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

const meta = {
  title: 'Core/Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'default', divided: true },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'flat', 'raised'] } },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader title="grain-web" subtitle="Последний деплой 4 мин назад" actions={<IconButton icon="ellipsis" label="Ещё" />} />
      <CardBody>Production · main · 3f9a2c1</CardBody>
      <CardFooter><Button size="sm">Логи</Button><Button size="sm" variant="solid">Открыть</Button></CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Flat: Story = { args: { variant: 'flat' } };
export const Raised: Story = { args: { variant: 'raised' } };
export const Interactive: Story = { args: { interactive: true } };
