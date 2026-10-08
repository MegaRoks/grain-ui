import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('рендерит текст и вызывает onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Деплой</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Деплой' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('по умолчанию type="button" и variant secondary', () => {
    render(<Button>Ок</Button>);
    const b = screen.getByRole('button');
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('gr-btn', 'gr-btn--secondary');
  });
  it('loading блокирует кнопку и показывает спиннер', async () => {
    const onClick = vi.fn();
    render(<Button loading iconStart="rocket" onClick={onClick}>Сборка</Button>);
    const b = screen.getByRole('button');
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });
  it('пробрасывает ref и className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="x" size="lg">A</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('x', 'gr-btn--lg');
  });
});
