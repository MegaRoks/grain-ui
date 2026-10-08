import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('закрыт — ничего не рендерит', () => {
    render(<Dialog open={false} title="T" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('открыт — доступен по заголовку', () => {
    render(<Dialog open title="Заголовок" description="Описание">Тело</Dialog>);
    expect(screen.getByRole('dialog', { name: 'Заголовок' })).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Тело')).toBeInTheDocument();
  });
  it('закрывается по Escape, крестику и scrim', async () => {
    const onClose = vi.fn();
    render(<Dialog open title="T" onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    await userEvent.click(screen.getByTestId('scrim'));
    expect(onClose).toHaveBeenCalledTimes(3);
  });
  it('без onClose нет крестика', () => {
    render(<Dialog open title="T" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
