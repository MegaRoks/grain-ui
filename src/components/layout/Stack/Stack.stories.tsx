import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Stack, Inline, Grid, GridItem } from './Stack';
import { Card, CardBody } from '../../core/Card';
import { Button } from '../../core/Button';

const Box = ({ children }: { children: ReactNode }) => (
  <Card variant="flat"><CardBody style={{ padding: 12, fontSize: 13 }}>{children}</CardBody></Card>
);

const meta = {
  title: 'Layout/Stack & Grid',
  component: Stack,
  subcomponents: { Inline, Grid, GridItem },
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { gap: 3 },
  argTypes: { gap: { control: 'select', options: [0, 1, 2, 3, 4, 6, 8] } },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = { render: (args) => <Stack {...args} style={{ width: 280 }}><Box>Один</Box><Box>Два</Box><Box>Три</Box></Stack> };
export const Row: Story = {
  render: (args) => (
    <Inline {...args} justify="space-between" style={{ width: 420 }}>
      <strong>Проекты</strong>
      <Inline gap={2}><Button size="sm">Импорт</Button><Button size="sm" variant="solid">Новый</Button></Inline>
    </Inline>
  ),
};
export const ResponsiveGrid: Story = {
  render: () => (
    <Grid minColumnWidth={200} gap={4} style={{ width: 'min(100%, 880px)' }}>
      {['Запросы', 'Ошибки', 'p95', 'Деплои', 'Трафик', 'Пользователи'].map((t) => <Box key={t}>{t}</Box>)}
    </Grid>
  ),
};
export const DashboardGrid: Story = {
  render: () => (
    <Grid columns={4} gap={4} style={{ width: 880 }}>
      <Box>KPI</Box><Box>KPI</Box><Box>KPI</Box><Box>KPI</Box>
      <GridItem span={3}><Box>График</Box></GridItem>
      <Box>Список</Box>
      <GridItem span="full"><Box>Таблица</Box></GridItem>
    </Grid>
  ),
};
