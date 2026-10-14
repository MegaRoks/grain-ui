import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

const openTip = () => {
  act(() => vi.advanceTimersByTime(450));
  act(() => vi.advanceTimersToNextFrame());
};

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('открывается после задержки и закрывается при уходе', () => {
    render(<Tooltip content="Подсказка" delay={400}><button>t</button></Tooltip>);
    const wrap = screen.getByText('t').parentElement!;
    fireEvent.mouseEnter(wrap);
    act(() => vi.advanceTimersByTime(399));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    openTip();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open');
    fireEvent.mouseLeave(wrap);
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('data-state', 'closed');
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
  });
  it('связывает триггер через aria-describedby и рендерится в портал', () => {
    const { container } = render(<Tooltip content="Поиск"><button>t</button></Tooltip>);
    act(() => screen.getByRole('button').focus());
    openTip();
    const tip = screen.getByRole('tooltip');
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tip.id);
    expect(container).not.toContainElement(tip);
    expect(tip.style.position).toBe('fixed');
  });
  it('Escape скрывает', () => {
    render(<Tooltip content="Поиск"><button>t</button></Tooltip>);
    act(() => screen.getByRole('button').focus());
    openTip();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('data-state', 'closed');
  });
  it('показывает shortcut', () => {
    render(<Tooltip content="Поиск" shortcut="⌘K"><button>t</button></Tooltip>);
    act(() => screen.getByRole('button').focus());
    openTip();
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });
});
