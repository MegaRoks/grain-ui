import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, Toaster } from './Toast';

describe('Toast', () => {
  it('error-тост — alert, остальные — status', () => {
    render(<><Toast title="A" tone="error" /><Toast title="B" /></>);
    expect(screen.getByRole('alert')).toHaveTextContent('A');
    expect(screen.getByRole('status')).toHaveTextContent('B');
  });
  it('кнопка скрытия вызывает onDismiss', async () => {
    const onDismiss = vi.fn();
    render(<Toast title="A" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Скрыть' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe('Toaster', () => {
  const toasts = Array.from({ length: 6 }, (_, i) => ({ id: i, title: 'T' + i }));
  it('держит не больше max тостов', () => {
    render(<Toaster toasts={toasts} max={4} />);
    expect(screen.getAllByRole('status')).toHaveLength(4);
  });
  it('скрыть можно только передний, с его id', async () => {
    const onDismiss = vi.fn();
    render(<Toaster toasts={toasts} onDismiss={onDismiss} />);
    const btns = screen.getAllByRole('button', { name: 'Скрыть' });
    expect(btns).toHaveLength(1);
    await userEvent.click(btns[0]);
    expect(onDismiss).toHaveBeenCalledWith(0);
  });
});
