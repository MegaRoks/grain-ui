import { render, screen } from '@testing-library/react';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('имеет доступное имя из label', () => {
    render(<IconButton icon="x" label="Закрыть" />);
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });
  it('pressed → aria-pressed', () => {
    render(<IconButton icon="pin" label="Пин" pressed />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
  it('без pressed не ставит aria-pressed', () => {
    render(<IconButton icon="pin" label="Пин" />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });
});
