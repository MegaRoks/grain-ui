import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table, type TableColumn } from './Table';
import { Badge } from '../../core/Badge';
import { Avatar } from '../Avatar';
import { Button } from '../../core/Button';

type Deploy = { id: string; project: string; branch: string; status: 'ready' | 'building' | 'error'; author: string; duration: number; created: Date };
const now = Date.now();
const DATA: Deploy[] = [
  { id: 'd1', project: 'grain-web', branch: 'main', status: 'ready', author: 'Анна Петрова', duration: 42, created: new Date(now - 4 * 6e4) },
  { id: 'd2', project: 'api', branch: 'feat/billing', status: 'building', author: 'Иван Смирнов', duration: 118, created: new Date(now - 12 * 6e4) },
  { id: 'd3', project: 'docs', branch: 'main', status: 'error', author: 'Ольга К', duration: 9, created: new Date(now - 55 * 6e4) },
  { id: 'd4', project: 'grain-web', branch: 'fix/nav', status: 'ready', author: 'Марк Лебедев', duration: 51, created: new Date(now - 3 * 36e5) },
  { id: 'd5', project: 'dashboard', branch: 'main', status: 'ready', author: 'Анна Петрова', duration: 77, created: new Date(now - 26 * 36e5) },
];
const STATUS = { ready: ['success', 'Готов'], building: ['warning', 'Сборка'], error: ['danger', 'Ошибка'] } as const;
const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });
const ago = (d: Date) => { const m = Math.round((d.getTime() - now) / 6e4); return Math.abs(m) < 60 ? rtf.format(m, 'minute') : Math.abs(m) < 1440 ? rtf.format(Math.round(m / 60), 'hour') : rtf.format(Math.round(m / 1440), 'day'); };

const columns: TableColumn<Deploy>[] = [
  { key: 'project', header: 'Проект', sortable: true, cell: (r) => <strong style={{ fontWeight: 500, color: 'var(--text-strong)' }}>{r.project}</strong> },
  { key: 'branch', header: 'Ветка', cell: (r) => <code>{r.branch}</code> },
  { key: 'status', header: 'Статус', sortable: true, cell: (r) => <Badge tone={STATUS[r.status][0]} dot>{STATUS[r.status][1]}</Badge> },
  { key: 'author', header: 'Автор', cell: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={r.author} size="xs" />{r.author}</span> },
  { key: 'duration', header: 'Время', sortable: true, align: 'right', cell: (r) => r.duration + ' с' },
  { key: 'created', header: 'Создан', sortable: true, align: 'right', cell: (r) => ago(r.created) },
];

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { columns: columns as TableColumn<unknown>[], rows: DATA, rowKey: 'id' as never, caption: 'Деплои' },
  argTypes: { density: { control: 'inline-radio', options: ['default', 'compact'] } },
  decorators: [(S) => <div style={{ maxWidth: 880 }}><S /></div>],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultSort: { key: 'created', direction: 'desc' } } };
export const Selectable: Story = {
  render: (args) => {
    const [sel, setSel] = useState<(string | number)[]>(['d2']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32, fontSize: 13, color: 'var(--text-muted)' }}>
          {sel.length ? <>Выбрано: {sel.length}<Button size="sm" variant="danger">Отменить деплои</Button></> : 'Выберите строки'}
        </div>
        <Table {...args} selectedKeys={sel} onSelectionChange={setSel} />
      </div>
    );
  },
};
export const Compact: Story = { args: { density: 'compact' } };
export const StickyHeader: Story = { args: { maxHeight: 200, rows: [...DATA, ...DATA.map((d) => ({ ...d, id: d.id + 'b' })), ...DATA.map((d) => ({ ...d, id: d.id + 'c' }))] } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { rows: [], empty: 'Деплоев пока нет — запушьте в main, чтобы запустить первый.' } };
