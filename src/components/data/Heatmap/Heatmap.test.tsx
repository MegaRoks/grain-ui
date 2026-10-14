import { render, screen, fireEvent, act } from '@testing-library/react';
import { Heatmap, CalendarHeatmap, calendarMatrix, levelOf } from './Heatmap';

const values = [[0, 2, 4], [1, null, 8]];

describe('Heatmap', () => {
  it('levelOf: 0 для пусто/нуля, верхняя ступень для максимума', () => {
    expect(levelOf(null, 8, 4)).toBe(0);
    expect(levelOf(0, 8, 4)).toBe(0);
    expect(levelOf(1, 8, 4)).toBe(1);
    expect(levelOf(8, 8, 4)).toBe(4);
    expect(levelOf(99, 8, 4)).toBe(4);
  });
  it('рисует ячейки со ступенями и скрытую таблицу', () => {
    const { container } = render(<Heatmap label="Активность" values={values} rowLabels={['Утро', 'Вечер']} />);
    expect(screen.getByRole('img', { name: 'Активность' })).toBeInTheDocument();
    const cells = container.querySelectorAll('.gr-heatmap__cell');
    expect(cells).toHaveLength(6);
    expect(cells[5]).toHaveAttribute('data-level', '4');
    expect(cells[4]).toHaveAttribute('data-empty', 'true');
    expect(screen.getByRole('table', { name: 'Активность' })).toHaveTextContent('Вечер');
  });
  it('клавиатура двигает активную ячейку и показывает значение', () => {
    render(<Heatmap label="А" values={values} cellLabel={(v, r, c) => r + ':' + c + '=' + (v ?? '—')} />);
    const grid = screen.getByRole('img', { name: 'А' });
    act(() => grid.focus());
    expect(screen.getByRole('status')).toHaveTextContent('0:2=4');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    expect(screen.getByRole('status')).toHaveTextContent('1:2=8');
    fireEvent.keyDown(grid, { key: 'Home' });
    expect(screen.getByRole('status')).toHaveTextContent('1:0=1');
  });
  it('calendarMatrix: недели с понедельника, дни вне периода — null', () => {
    // 2026-10-14 — среда
    const m = calendarMatrix([{ date: '2026-10-14', value: 3 }, { date: '2026-10-20', value: 5 }]);
    expect(m.values).toHaveLength(7);
    expect(m.values[0][0]).toBeNull();
    expect(m.values[2][0]).toBe(3);
    expect(m.values[1][1]).toBe(5);
    expect(m.values[0]).toHaveLength(2);
  });
  it('CalendarHeatmap рендерится', () => {
    render(<CalendarHeatmap label="Тренировки" days={[{ date: '2026-10-12', value: 1 }, { date: '2026-10-18', value: 2 }]} />);
    expect(screen.getByRole('img', { name: 'Тренировки' })).toBeInTheDocument();
  });
});
