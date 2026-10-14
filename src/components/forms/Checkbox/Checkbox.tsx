import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  /** Вторая строка приглушённого пояснения. */
  description?: React.ReactNode;
}

/** Чекбокс: контролируемый (checked) или нет (defaultChecked). Отметка рисуется через CSS :checked. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, disabled, className, ...rest },
  ref,
) {
  return (
    <label className={cx('gr-check', disabled && 'gr-check--disabled', className)} style={{ position: 'relative' }}>
      <input ref={ref} type="checkbox" disabled={disabled} {...rest} />
      <span className="gr-check__box"><Icon name="check" size={11} strokeWidth={2.5} /></span>
      {label || description ? (
        <span className="gr-check__text">
          <span>{label}</span>
          {description ? <span className="gr-check__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
});
