import { render, screen, fireEvent, act } from '@testing-library/react';
import { LineChart, BarChart, Sparkline, niceTicks } from './Chart';

const data = [
  { day: 'Пн', req: 120, err: 4 },
  { day: 'Вт', req: 180, err: 9 },
  { day: 'Ср', req: 90, err: 2 },
];
const series = [{ key: 'req', label: 'Запросы' }, { key: 'err', label: 'Ошибки' }];

describe('Chart', () => {
  it('niceTicks даёт «круглые» деления, покрывающие диапазон', () => {
    expect(niceTicks(0, 180)).toEqual([0, 50, 100, 150, 200]);
    expect(niceTicks(0, 1)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(niceTicks(5, 5)[0]).toBeLessThanOrEqual(5);
  });
  it('LineChart: доступное имя, легенда и скрытая таблица данных', () => {
    render(<LineChart label="Трафик за неделю" data={data} x="day" series={series} />);
    expect(screen.getByRole('img', { name: 'Трафик за неделю' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'Трафик за неделю' });
    expect(table).toHaveTextContent('Вт');
    expect(table).toHaveTextContent('180');
  });
  it('клавиатура показывает значения в подсказке', () => {
    render(<LineChart label="Трафик" data={data} x="day" series={series} />);
    const svg = screen.getByRole('img', { name: 'Трафик' });
    act(() => (svg as unknown as SVGElement).focus());
    expect(screen.getByRole('status')).toHaveTextContent('Ср');
    fireEvent.keyDown(svg, { key: 'Home' });
    expect(screen.getByRole('status')).toHaveTextContent('Пн');
    expect(screen.getByRole('status')).toHaveTextContent('120');
    act(() => (svg as unknown as SVGElement).blur());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('BarChart рисует столбец на каждое значение', () => {
    const { container } = render(<BarChart label="Деплои" data={data} x="day" series={series} />);
    expect(container.querySelectorAll('.gr-chart__bar')).toHaveLength(6);
  });
  it('Sparkline — img с подписью', () => {
    render(<Sparkline data={[1, 3, 2, 5]} label="Рост" />);
    expect(screen.getByRole('img', { name: 'Рост' })).toBeInTheDocument();
  });
});
