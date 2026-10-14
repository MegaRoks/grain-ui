import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Table, type TableColumn } from './Table';

type Row = { id: number; name: string; requests: number };
const rows: Row[] = [
  { id: 1, name: 'grain-web', requests: 1200 },
  { id: 2, name: 'api', requests: 98000 },
  { id: 3, name: 'docs', requests: 40 },
];
const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Проект', sortable: true },
  { key: 'requests', header: 'Запросы', sortable: true, align: 'right', cell: (r) => r.requests.toLocaleString('ru') },
];
const firstCol = () => screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent);

function Selectable() {
  const [sel, setSel] = useState<(string | number)[]>([]);
  return <Table caption="Проекты" columns={columns} rows={rows} rowKey="id" selectedKeys={sel} onSelectionChange={setSel} selectRowLabel={(r) => 'Выбрать ' + r.name} />;
}

describe('Table', () => {
  it('рендерит строки и подпись', () => {
    render(<Table caption="Проекты" columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByRole('table', { name: 'Проекты' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Проекты' })).toBeInTheDocument();
    expect(firstCol()).toEqual(['grain-web', 'api', 'docs']);
  });
  it('сортирует: по возрастанию → по убыванию → сброс, с aria-sort', async () => {
    render(<Table columns={columns} rows={rows} rowKey="id" />);
    const th = screen.getByRole('columnheader', { name: /Запросы/ });
    expect(th).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(th).getByRole('button'));
    expect(th).toHaveAttribute('aria-sort', 'ascending');
    expect(firstCol()).toEqual(['docs', 'grain-web', 'api']);
    await userEvent.click(within(th).getByRole('button'));
    expect(th).toHaveAttribute('aria-sort', 'descending');
    expect(firstCol()).toEqual(['api', 'grain-web', 'docs']);
    await userEvent.click(within(th).getByRole('button'));
    expect(firstCol()).toEqual(['grain-web', 'api', 'docs']);
  });
  it('manualSort не меняет порядок, но сообщает о сортировке', async () => {
    const onSortChange = vi.fn();
    render(<Table columns={columns} rows={rows} rowKey="id" manualSort onSortChange={onSortChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Проект/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    expect(firstCol()).toEqual(['grain-web', 'api', 'docs']);
  });
  it('выбор строк и «выбрать все» с indeterminate', async () => {
    render(<Selectable />);
    const all = screen.getByRole('checkbox', { name: 'Выбрать все' }) as HTMLInputElement;
    await userEvent.click(screen.getByRole('checkbox', { name: 'Выбрать api' }));
    expect(all.indeterminate).toBe(true);
    expect(screen.getAllByRole('row')[2]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(all);
    expect(all).toBeChecked();
    expect(all.indeterminate).toBe(false);
    await userEvent.click(all);
    expect(screen.getByRole('checkbox', { name: 'Выбрать api' })).not.toBeChecked();
  });
  it('пустое состояние и загрузка', () => {
    const { rerender } = render(<Table columns={columns} rows={[]} rowKey="id" empty="Проектов пока нет" />);
    expect(screen.getByText('Проектов пока нет')).toBeInTheDocument();
    rerender(<Table columns={columns} rows={[]} rowKey="id" loading loadingRows={3} />);
    expect(screen.getByRole('table', { hidden: true })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('row', { hidden: true })).toHaveLength(4);
  });
});
