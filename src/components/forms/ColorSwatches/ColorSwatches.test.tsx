import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ColorSwatches, isLightColor } from './ColorSwatches';

const options = [
  { value: 'blue', color: '#2F6BFF', label: 'Синий' },
  { value: 'mint', color: '#BFF0D4', label: 'Мята' },
  { value: 'brand', color: 'var(--chart-3)', label: 'Янтарь' },
];

function Harness({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('blue');
  return <ColorSwatches label="Цвет категории" options={options} value={v} onChange={(x) => { setV(x); onChange?.(x); }} />;
}

describe('ColorSwatches', () => {
  it('radiogroup с подписью; цвета доступны по названию', () => {
    render(<Harness />);
    expect(screen.getByRole('radiogroup', { name: 'Цвет категории' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Синий' })).toBeChecked();
  });
  it('клик выбирает цвет', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Мята' }));
    expect(onChange).toHaveBeenCalledWith('mint');
    expect(screen.getByRole('radio', { name: 'Мята' })).toBeChecked();
  });
  it('стрелки переключают (нативный radio)', async () => {
    render(<Harness />);
    screen.getByRole('radio', { name: 'Синий' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Мята' })).toBeChecked();
  });
  it('неконтролируемый режим', async () => {
    render(<ColorSwatches aria-label="Цвет" options={options} defaultValue="mint" />);
    expect(screen.getByRole('radio', { name: 'Мята' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Синий' }));
    expect(screen.getByRole('radio', { name: 'Синий' })).toBeChecked();
  });
  it('isLightColor', () => {
    expect(isLightColor('#BFF0D4')).toBe(true);
    expect(isLightColor('#2F6BFF')).toBe(false);
    expect(isLightColor('#fff')).toBe(true);
    expect(isLightColor('var(--x)')).toBe(false);
  });
});
