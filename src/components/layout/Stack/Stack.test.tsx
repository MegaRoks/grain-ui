import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Stack, Inline, Grid, GridItem, space } from './Stack';

describe('Stack / Grid', () => {
  it('space() мапит шаг на токен', () => {
    expect(space(1.5)).toBe('var(--space-1-5)');
    expect(space(4)).toBe('var(--space-4)');
  });
  it('Stack: колонка по умолчанию, gap из токена, as и ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Stack ref={ref} as="section" gap={2} data-testid="s">x</Stack>);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveClass('gr-stack');
    expect(el.style.gap).toBe('var(--space-2)');
    expect(ref.current).toBe(el);
  });
  it('Inline — строка с выравниванием по центру', () => {
    render(<Inline data-testid="i">x</Inline>);
    expect(screen.getByTestId('i')).toHaveClass('gr-stack--row');
    expect(screen.getByTestId('i').style.alignItems).toBe('center');
  });
  it('Grid: фиксированные и адаптивные колонки', () => {
    render(<><Grid columns={3} data-testid="a" /><Grid minColumnWidth={240} data-testid="b" /></>);
    expect(screen.getByTestId('a').style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(screen.getByTestId('b').style.gridTemplateColumns).toContain('auto-fill');
  });
  it('GridItem span', () => {
    render(<GridItem span="full" data-testid="g" />);
    expect(screen.getByTestId('g').style.gridColumn).toBe('1 / -1');
  });
});
