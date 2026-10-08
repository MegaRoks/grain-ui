import * as React from 'react';
import { cx } from '../../../utils/cx';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  size?: 'md' | 'lg';
}

/** Переключатель с мгновенным применением. Бегунок движется только transform, 140ms ease-out. */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, checked, disabled, size = 'md', className, ...rest },
  ref,
) {
  return (
    <label className={cx('gr-switch', checked && 'gr-switch--on', size === 'lg' && 'gr-switch--lg', disabled && 'gr-switch--disabled', className)} style={{ position: 'relative' }}>
      <input ref={ref} type="checkbox" role="switch" checked={checked} disabled={disabled} {...rest} />
      <span className="gr-switch__track"><span className="gr-switch__thumb" /></span>
      {label ? <span className="gr-switch__label">{label}</span> : null}
    </label>
  );
});
