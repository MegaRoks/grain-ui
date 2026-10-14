import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText, LoadingRegion } from './Skeleton';
import { Card, CardBody } from '../../core/Card';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  subcomponents: { SkeletonText, LoadingRegion },
  tags: ['autodocs'],
  args: { width: 200, shape: 'rect' },
  argTypes: { shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CardPlaceholder: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" width={32} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}><Skeleton shape="text" width="50%" /><Skeleton shape="text" width="30%" /></div>
        </div>
        <SkeletonText lines={3} />
      </CardBody>
    </Card>
  ),
};
export const KpiPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[0, 1, 2].map((i) => (
        <Card key={i} style={{ width: 180 }}><CardBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><Skeleton shape="text" width="40%" /><Skeleton height={28} width="70%" /></CardBody></Card>
      ))}
    </div>
  ),
};
