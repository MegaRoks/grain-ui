import * as React from 'react';
import { cx } from '../../../utils/cx';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  size?: 'md' | 'lg';
}

/** Переключатель с мгновенным применением. Состояние — из :checked, работает и без контроля. */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, disabled, size = 'md', className, ...rest },
  ref,
) {
  return (
    <label className={cx('gr-switch', size === 'lg' && 'gr-switch--lg', disabled && 'gr-switch--disabled', className)} style={{ position: 'relative' }}>
      <input ref={ref} type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="gr-switch__track"><span className="gr-switch__thumb" /></span>
      {label ? <span className="gr-switch__label">{label}</span> : null}
    </label>
  );
});
