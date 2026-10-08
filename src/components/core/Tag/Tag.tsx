import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Иконка Lucide перед текстом. */
  icon?: string;
  /** Если задан — показывается кнопка удаления. */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Доступное имя кнопки удаления. */
  removeLabel?: string;
}

/** Токен-«пилюля» для фильтров, получателей и выбранных значений. */
export function Tag({ children, onRemove, removeLabel = 'Удалить', icon, className, style, ...rest }: TagProps) {
  return (
    <span className={cx('gr-tag', className)} style={onRemove ? style : { paddingRight: 'var(--space-2)', ...style }} {...rest}>
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
      {onRemove ? (
        <button type="button" className="gr-tag__x" aria-label={removeLabel} onClick={onRemove}>
          <Icon name="x" size={11} />
        </button>
      ) : null}
    </span>
  );
}
