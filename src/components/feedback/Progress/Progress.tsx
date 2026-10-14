import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Progress.css';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Текущее значение. Не задавайте для неопределённого прогресса. */
  value?: number;
  max?: number;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  /** Подпись над полосой; также доступное имя. */
  label?: React.ReactNode;
  /** Показать значение справа от подписи. true — проценты; функция — свой формат. */
  showValue?: boolean | ((value: number, max: number) => React.ReactNode);
}

/** Полоса прогресса. Заполнение движется transform: scaleX — без перерисовки layout. */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, tone = 'accent', size = 'md', label, showValue, className, ...rest },
  ref,
) {
  const labelId = React.useId();
  const indeterminate = value === undefined;
  const v = indeterminate ? 0 : Math.max(0, Math.min(value, max));
  const ratio = max > 0 ? v / max : 0;
  const shown = typeof showValue === 'function' ? showValue(v, max) : showValue ? Math.round(ratio * 100) + '%' : null;
  return (
    <div ref={ref} className={cx('gr-progress', 'gr-progress--' + tone, size === 'sm' && 'gr-progress--sm', className)} {...rest}>
      {label || shown !== null ? (
        <div className="gr-progress__head">
          {label ? <span id={labelId} className="gr-progress__label">{label}</span> : <span />}
          {shown !== null && !indeterminate ? <span className="gr-progress__value">{shown}</span> : null}
        </div>
      ) : null}
      <div
        className={cx('gr-progress__track', indeterminate && 'gr-progress__track--indeterminate')}
        role="progressbar"
        aria-labelledby={label ? labelId : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : v}
      >
        <span className="gr-progress__fill" style={indeterminate ? undefined : { transform: 'scaleX(' + ratio + ')' }} />
      </div>
    </div>
  );
});
