import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Stack.css';

/** Шаг шкалы отступов: соответствует токену --space-<step>. */
export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
export const space = (s: SpaceStep) => 'var(--space-' + String(s).replace('.', '-') + ')';

type Polymorphic = { as?: keyof JSX.IntrinsicElements };

export interface StackProps extends React.HTMLAttributes<HTMLElement>, Polymorphic {
  direction?: 'column' | 'row';
  gap?: SpaceStep;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  /** Растянуть на всю ширину/высоту родителя по главной оси. */
  grow?: boolean;
}

/** Flex-раскладка с отступами из шкалы токенов. Для строк используйте <Inline> (= Stack direction="row"). */
export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(
  { as = 'div', direction = 'column', gap = 3, align, justify, wrap, grow, className, style, ...rest },
  ref,
) {
  return React.createElement(as, {
    ref,
    className: cx('gr-stack', direction === 'row' && 'gr-stack--row', wrap && 'gr-stack--wrap', grow && 'gr-stack--grow', className),
    style: { gap: space(gap), alignItems: align, justifyContent: justify, ...style },
    ...rest,
  });
});

export const Inline = React.forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(function Inline({ align = 'center', ...props }, ref) {
  return <Stack ref={ref} direction="row" align={align} {...props} />;
});

export interface GridProps extends React.HTMLAttributes<HTMLElement>, Polymorphic {
  /** Фиксированное число колонок. */
  columns?: number;
  /** Адаптивная сетка: столько колонок, сколько влезает при этой минимальной ширине (px или CSS-длина). */
  minColumnWidth?: number | string;
  gap?: SpaceStep;
  rowGap?: SpaceStep;
}

/** CSS Grid. minColumnWidth — адаптивные карточки без медиа-запросов; columns — фиксированная сетка. */
export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(
  { as = 'div', columns, minColumnWidth, gap = 4, rowGap, className, style, ...rest },
  ref,
) {
  const min = typeof minColumnWidth === 'number' ? minColumnWidth + 'px' : minColumnWidth;
  const template = min
    ? 'repeat(auto-fill, minmax(min(' + min + ', 100%), 1fr))'
    : 'repeat(' + (columns ?? 1) + ', minmax(0, 1fr))';
  return React.createElement(as, {
    ref,
    className: cx('gr-grid', className),
    style: { gridTemplateColumns: template, gap: space(gap), rowGap: rowGap !== undefined ? space(rowGap) : undefined, ...style },
    ...rest,
  });
});

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Сколько колонок занять; 'full' — всю строку. */
  span?: number | 'full';
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(function GridItem({ span = 1, style, ...rest }, ref) {
  return <div ref={ref} style={{ gridColumn: span === 'full' ? '1 / -1' : 'span ' + span, minWidth: 0, ...style }} {...rest} />;
});
