import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ChipGroup } from './ChipGroup';

const options = [
  { value: 'food', label: 'Еда', count: 12 },
  { value: 'transport', label: 'Транспорт' },
  { value: 'fun', label: 'Развлечения', disabled: true },
];

function Multi({ onChange }: { onChange?: (v: string[]) => void }) {
  const [v, setV] = useState<string[]>(['food']);
  return <ChipGroup label="Категории" options={options} value={v} onChange={(x) => { setV(x); onChange?.(x); }} />;
}

describe('ChipGroup', () => {
  it('multiple: группа чекбоксов с подписью', () => {
    render(<Multi />);
    expect(screen.getByRole('group', { name: 'Категории' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Еда/ })).toBeChecked();
  });
  it('multiple: добавляет и снимает значения', async () => {
    const onChange = vi.fn();
    render(<Multi onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Транспорт' }));
    expect(onChange).toHaveBeenLastCalledWith(['food', 'transport']);
    await userEvent.click(screen.getByRole('checkbox', { name: /Еда/ }));
    expect(onChange).toHaveBeenLastCalledWith(['transport']);
  });
  it('disabled-чип не переключается', async () => {
    const onChange = vi.fn();
    render(<Multi onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Развлечения' }));
    expect(onChange).not.toHaveBeenCalled();
  });
  it('multiple={false}: radiogroup с одним значением', async () => {
    const onChange = vi.fn();
    render(<ChipGroup aria-label="Период" multiple={false} defaultValue="week" onChange={onChange} options={[{ value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' }]} />);
    expect(screen.getByRole('radiogroup', { name: 'Период' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Неделя' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Месяц' }));
    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Месяц' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Неделя' })).not.toBeChecked();
  });
  it('неконтролируемый multiple', async () => {
    render(<ChipGroup aria-label="Ф" options={options} defaultValue={['transport']} />);
    expect(screen.getByRole('checkbox', { name: 'Транспорт' })).toBeChecked();
    await userEvent.click(screen.getByRole('checkbox', { name: /Еда/ }));
    expect(screen.getByRole('checkbox', { name: /Еда/ })).toBeChecked();
  });
});
