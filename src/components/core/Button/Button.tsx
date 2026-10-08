import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** solid — главное действие, accent — бренд, secondary — по умолчанию, ghost — тулбар, danger — деструктивное. */
  variant?: 'solid' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Иконка Lucide перед текстом. */
  iconStart?: string;
  /** Иконка Lucide после текста. */
  iconEnd?: string;
  /** Заменяет иконку спиннером и блокирует кнопку. */
  loading?: boolean;
  fullWidth?: boolean;
}

/** Основной нажимаемый контрол. Отклик на нажатие (scale 0.97 / 140ms ease-out) встроен. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', iconStart, iconEnd, loading = false, disabled, fullWidth, className, style, children, type = 'button', ...rest },
  ref,
) {
  const iconSize = size === 'lg' ? 18 : size === 'sm' ? 13 : 15;
  return (
    <button
      ref={ref}
      type={type}
      className={cx('gr-btn', 'gr-btn--' + variant, size !== 'md' && 'gr-btn--' + size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      style={fullWidth ? { width: '100%', ...style } : style}
      {...rest}
    >
      {loading ? <span className="gr-btn__spinner" data-testid="spinner" /> : iconStart ? <Icon name={iconStart} size={iconSize} /> : null}
      {children}
      {iconEnd && !loading ? <Icon name={iconEnd} size={iconSize} /> : null}
    </button>
  );
});
