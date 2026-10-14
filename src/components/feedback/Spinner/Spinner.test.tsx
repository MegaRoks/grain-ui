import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('объявляется как status с подписью', () => {
    render(<Spinner label="Сборка" />);
    expect(screen.getByRole('status')).toHaveTextContent('Сборка');
  });
  it('label="" — декоративный', () => {
    const { container } = render(<Spinner label="" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
  it('размер через модификатор', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('gr-spinner--lg');
  });
});
