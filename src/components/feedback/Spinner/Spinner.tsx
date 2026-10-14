import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Spinner.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Текст для скринридеров. Пустая строка — декоративный спиннер (aria-hidden). */
  label?: string;
}

/** Индикатор загрузки неизвестной длительности. Вращается linear — постоянное движение. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Загрузка', className, ...rest },
  ref,
) {
  const decorative = label === '';
  return (
    <span
      ref={ref}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      className={cx('gr-spinner', size !== 'md' && 'gr-spinner--' + size, className)}
      {...rest}
    >
      <span className="gr-spinner__ring" />
      {decorative ? null : <span className="gr-sr-only">{label}</span>}
    </span>
  );
});
