import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Имя иконки Lucide. */
  icon: string;
  /** Обязательное доступное имя — у кнопки нет текста. */
  label: string;
  variant?: 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  /** Постоянный «нажатый» фон через aria-pressed. */
  pressed?: boolean;
}

/** Квадратная кнопка-иконка для тулбаров, строк таблиц и закрытия диалогов. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'ghost', size = 'md', pressed, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('gr-iconbtn', variant !== 'ghost' && 'gr-iconbtn--' + variant, size !== 'md' && 'gr-iconbtn--' + size, className)}
      aria-label={label}
      aria-pressed={pressed}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 18 : size === 'sm' ? 13 : 15} />
    </button>
  );
});
