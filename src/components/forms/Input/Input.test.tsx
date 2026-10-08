import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('связывает label с полем', () => {
    render(<Input label="Имя" />);
    expect(screen.getByLabelText('Имя')).toBeInstanceOf(HTMLInputElement);
  });
  it('печатает и вызывает onChange', async () => {
    const onChange = vi.fn();
    render(<Input label="Имя" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Имя'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByLabelText('Имя')).toHaveValue('abc');
  });
  it('error заменяет hint и ставит aria-invalid', () => {
    render(<Input label="Имя" hint="Подсказка" error="Ошибка" />);
    const el = screen.getByLabelText('Имя');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveAccessibleDescription('Ошибка');
    expect(screen.queryByText('Подсказка')).not.toBeInTheDocument();
  });
  it('показывает суффикс', () => {
    render(<Input suffix=".grain.dev" />);
    expect(screen.getByText('.grain.dev')).toBeInTheDocument();
  });
});
