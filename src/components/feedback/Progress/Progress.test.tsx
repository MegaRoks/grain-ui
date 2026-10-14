import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('progressbar с именем и значением', () => {
    render(<Progress label="Сборка" value={40} showValue />);
    const bar = screen.getByRole('progressbar', { name: 'Сборка' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
  it('ограничивает значение диапазоном', () => {
    render(<Progress value={250} max={200} aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '200');
  });
  it('неопределённый — без aria-valuenow', () => {
    render(<Progress label="Ждём" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
  it('свой формат значения', () => {
    render(<Progress value={3} max={8} showValue={(v, m) => v + ' из ' + m} />);
    expect(screen.getByText('3 из 8')).toBeInTheDocument();
  });
});
