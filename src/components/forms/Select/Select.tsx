import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';

export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Строки или пары {value, label}. */
  options?: Array<string | SelectOption>;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLE: Record<string, React.CSSProperties | undefined> = {
  sm: { height: 'var(--control-h-sm)', fontSize: 'var(--text-12)' },
  md: undefined,
  lg: { height: 'var(--control-h-lg)' },
};

/** Нативный select в стиле Grain — клавиатура и мобильное поведение из коробки. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, options = [], size = 'md', id, style, className, ...rest },
  ref,
) {
  const autoId = React.useId();
  const selectId = id || autoId;
  return (
    <div className="gr-field" style={style}>
      {label ? <label className="gr-field__label" htmlFor={selectId}>{label}</label> : null}
      <div className={cx('gr-select', className)}>
        <select ref={ref} id={selectId} className="gr-select__el" style={SIZE_STYLE[size]} {...rest}>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <span className="gr-select__caret"><Icon name="chevron-down" size={14} /></span>
      </div>
      {hint ? <span className="gr-field__hint">{hint}</span> : null}
    </div>
  );
});
