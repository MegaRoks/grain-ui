import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  AppShell, Sidebar, SidebarSection, NavItem, Avatar, Badge, Button, Card, CardHeader, CardBody,
  Grid, GridItem, Inline, Stack, Tabs, TabPanel, Table, LineChart, BarChart, Sparkline, Progress,
  Skeleton, LoadingRegion, Input, Popover, PopoverItem, IconButton, Tooltip, type TableColumn,
} from '../index';

type Deploy = { id: string; project: string; branch: string; status: 'ready' | 'building' | 'error'; duration: number };
const DEPLOYS: Deploy[] = [
  { id: '1', project: 'grain-web', branch: 'main', status: 'ready', duration: 42 },
  { id: '2', project: 'api', branch: 'feat/billing', status: 'building', duration: 118 },
  { id: '3', project: 'docs', branch: 'main', status: 'error', duration: 9 },
  { id: '4', project: 'dashboard', branch: 'fix/nav', status: 'ready', duration: 51 },
];
const STATUS = { ready: ['success', 'Готов'], building: ['warning', 'Сборка'], error: ['danger', 'Ошибка'] } as const;
const traffic = Array.from({ length: 14 }, (_, i) => ({ day: i + 1 + ' окт', requests: Math.round(4200 + Math.sin(i / 2) * 900 + i * 120), errors: Math.round(40 + Math.cos(i) * 18) }));
const KPI = [
  { t: 'Запросы', v: '58,2 тыс.', delta: '+12%', d: [3, 4, 3.5, 5, 4.8, 6, 6.4] },
  { t: 'Ошибки', v: '0,4%', delta: '−0,1 п.п.', d: [5, 4, 4.5, 3, 3.2, 2.4, 2] },
  { t: 'p95', v: '182 мс', delta: '+8 мс', d: [2, 2.4, 2.2, 3.1, 2.8, 3.4, 3.2] },
  { t: 'Деплои', v: '128', delta: '+24', d: [8, 12, 9, 14, 16, 13, 18] },
];

function Dashboard({ loading }: { loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('Обзор');
  const [menu, setMenu] = useState(false);
  const [sel, setSel] = useState<(string | number)[]>([]);
  const columns: TableColumn<Deploy>[] = [
    { key: 'project', header: 'Проект', sortable: true, cell: (r) => <strong style={{ fontWeight: 500, color: 'var(--text-strong)' }}>{r.project}</strong> },
    { key: 'branch', header: 'Ветка', cell: (r) => <code>{r.branch}</code> },
    { key: 'status', header: 'Статус', sortable: true, cell: (r) => <Badge tone={STATUS[r.status][0]} dot>{STATUS[r.status][1]}</Badge> },
    { key: 'duration', header: 'Время', sortable: true, align: 'right', cell: (r) => r.duration + ' с' },
  ];
  return (
    <AppShell
      sidebarOpen={open}
      onSidebarOpenChange={setOpen}
      contained
      sidebar={
        <Sidebar
          header={<Inline gap={2} style={{ padding: '4px 8px', fontWeight: 600, fontSize: 14 }}><Avatar name="Grain" shape="square" size="sm" />grain</Inline>}
          footer={<Inline gap={2} style={{ fontSize: 13 }}><Avatar name="Анна Петрова" size="sm" status="online" />Анна Петрова</Inline>}
        >
          <SidebarSection>
            <NavItem href="#" icon="layout-dashboard" active>Обзор</NavItem>
            <NavItem href="#" icon="rocket" count={128}>Деплои</NavItem>
            <NavItem href="#" icon="scroll-text">Логи</NavItem>
            <NavItem href="#" icon="chart-line">Аналитика</NavItem>
          </SidebarSection>
          <SidebarSection label="Настройки">
            <NavItem href="#" icon="globe">Домены</NavItem>
            <NavItem href="#" icon="users">Команда</NavItem>
          </SidebarSection>
        </Sidebar>
      }
      header={
        <>
          <strong style={{ fontSize: 14, color: 'var(--text-strong)' }}>grain-web</strong>
          <Badge tone="success" dot>Production</Badge>
          <span style={{ flex: 1 }} />
          <div style={{ width: 220 }}><Input icon="search" placeholder="Поиск" aria-label="Поиск" size="sm" /></div>
          <Tooltip content="Уведомления" shortcut="N"><IconButton icon="bell" label="Уведомления" /></Tooltip>
          <div>
            <Button size="sm" variant="solid" iconEnd="chevron-down" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>Деплой</Button>
            <Popover open={menu} onClose={() => setMenu(false)} align="right" aria-label="Деплой">
              <PopoverItem icon="rocket">Задеплоить main</PopoverItem>
              <PopoverItem icon="rotate-ccw">Передеплоить последний</PopoverItem>
              <PopoverItem icon="undo-2">Откатить</PopoverItem>
            </Popover>
          </div>
        </>
      }
    >
      <Stack gap={6}>
        <Tabs id="dash" variant="underline" aria-label="Разделы" items={['Обзор', 'Деплои', 'Использование']} value={tab} onChange={setTab} />
        <TabPanel tabsId="dash" value="Обзор" hidden={tab !== 'Обзор'}>
          <LoadingRegion loading={loading} label="Загружаем метрики" fallback={
            <Grid columns={4} gap={4}>{KPI.map((k) => <Card key={k.t}><CardBody><Stack gap={2}><Skeleton shape="text" width="40%" /><Skeleton height={28} width="65%" /></Stack></CardBody></Card>)}</Grid>
          }>
            <Grid minColumnWidth={200} gap={4}>
              {KPI.map((k, i) => (
                <Card key={k.t}>
                  <CardBody>
                    <Inline justify="space-between" align="flex-end" gap={3}>
                      <Stack gap={1}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.t}</span>
                        <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.02em' }}>{k.v}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{k.delta} за неделю</span>
                      </Stack>
                      <Sparkline data={k.d} width={72} color={'var(--chart-' + (i + 1) + ')'} label={k.t + ': тренд за 7 дней'} />
                    </Inline>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </LoadingRegion>
          <Grid columns={3} gap={4} style={{ marginTop: 16 }}>
            <GridItem span={2}>
              <Card style={{ height: '100%' }}>
                <CardHeader title="Трафик" subtitle="Последние 14 дней" />
                <CardBody><LineChart label="Запросы за 14 дней" data={traffic} x="day" series={[{ key: 'requests', label: 'Запросы' }]} area height={220} /></CardBody>
              </Card>
            </GridItem>
            <Card>
              <CardHeader title="Ошибки" subtitle="5xx по дням" />
              <CardBody><BarChart label="Ошибки 5xx по дням" data={traffic.slice(-7)} x="day" series={[{ key: 'errors', label: '5xx', color: 'var(--chart-5)' }]} height={220} /></CardBody>
            </Card>
            <GridItem span="full">
              <Card>
                <CardHeader title="Лимиты плана" />
                <CardBody>
                  <Grid minColumnWidth={220} gap={6}>
                    <Progress label="Минуты сборки" value={3120} max={6000} showValue={(v, m) => v + ' / ' + m} />
                    <Progress label="Трафик" value={78} tone="warning" showValue />
                    <Progress label="Функции" value={97} tone="danger" showValue />
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </TabPanel>
        <TabPanel tabsId="dash" value="Деплои" hidden={tab !== 'Деплои'}>
          <Table caption="Последние деплои" columns={columns} rows={DEPLOYS} rowKey="id" loading={loading} selectedKeys={sel} onSelectionChange={setSel} />
        </TabPanel>
        <TabPanel tabsId="dash" value="Использование" hidden={tab !== 'Использование'}>
          <Card><CardBody style={{ color: 'var(--text-muted)' }}>Раздел в разработке.</CardBody></Card>
        </TabPanel>
      </Stack>
    </AppShell>
  );
}

const meta = {
  title: 'Patterns/Dashboard',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
  args: { loading: false },
} satisfies Meta<typeof Dashboard>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Переключите тему в тулбаре, чтобы проверить тёмную. Сузьте окно — сайдбар станет выезжающей панелью. */
export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
