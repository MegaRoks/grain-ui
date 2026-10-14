import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonText, LoadingRegion } from './Skeleton';

describe('Skeleton', () => {
  it('скрыт от скринридеров и принимает размеры', () => {
    const { container } = render(<Skeleton width={120} height={20} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('120px');
  });
  it('SkeletonText рисует N строк', () => {
    const { container } = render(<SkeletonText lines={4} />);
    expect(container.querySelectorAll('.gr-skeleton--text')).toHaveLength(4);
  });
  it('LoadingRegion: aria-busy и объявление, затем контент', () => {
    const { rerender } = render(<LoadingRegion loading fallback={<Skeleton />} data-testid="r">Данные</LoadingRegion>);
    expect(screen.getByTestId('r')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка');
    rerender(<LoadingRegion loading={false} fallback={<Skeleton />} data-testid="r">Данные</LoadingRegion>);
    expect(screen.getByTestId('r')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Данные')).toBeInTheDocument();
  });
});
