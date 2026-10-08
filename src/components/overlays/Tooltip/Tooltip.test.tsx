import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('открывается после задержки и закрывается при уходе', () => {
    render(<Tooltip content="Подсказка" delay={400}><button>t</button></Tooltip>);
    const tip = screen.getByRole('tooltip', { hidden: true });
    fireEvent.mouseEnter(screen.getByText('t').parentElement!);
    act(() => vi.advanceTimersByTime(399));
    expect(tip).toHaveAttribute('data-state', 'closed');
    act(() => vi.advanceTimersByTime(1));
    expect(tip).toHaveAttribute('data-state', 'open');
    fireEvent.mouseLeave(screen.getByText('t').parentElement!);
    expect(tip).toHaveAttribute('data-state', 'closed');
  });
  it('показывает shortcut', () => {
    render(<Tooltip content="Поиск" shortcut="⌘K"><button>t</button></Tooltip>);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });
});
