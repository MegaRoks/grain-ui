import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('применяет тон и точку', () => {
    const { container } = render(<Badge tone="danger" dot>Ошибка</Badge>);
    expect(screen.getByText('Ошибка')).toHaveClass('gr-badge', 'gr-badge--danger');
    expect(container.querySelector('.gr-badge__dot')).toBeInTheDocument();
  });
  it('neutral по умолчанию', () => {
    render(<Badge>A</Badge>);
    expect(screen.getByText('A')).toHaveClass('gr-badge--neutral');
  });
});
