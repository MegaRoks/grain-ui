import * as React from 'react';
import { cx } from '../../../utils/cx';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

/** Выбор одного из многих. Всегда внутри RadioGroup с общим name. */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, checked, disabled, className, ...rest },
  ref,
) {
  return (
    <label className={cx('gr-check', 'gr-check--radio', checked && 'gr-check--checked', disabled && 'gr-check--disabled', className)} style={{ position: 'relative' }}>
      <input ref={ref} type="radio" checked={checked} disabled={disabled} {...rest} />
      <span className="gr-check__box" />
      {label || description ? (
        <span className="gr-check__text">
          <span>{label}</span>
          {description ? <span className="gr-check__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
});

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export function RadioGroup({ label, children, className, ...rest }: RadioGroupProps) {
  const labelId = React.useId();
  return (
    <div role="radiogroup" aria-labelledby={label ? labelId : undefined} className={cx('gr-field', className)} {...rest}>
      {label ? <span id={labelId} className="gr-field__label">{label}</span> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>{children}</div>
    </div>
  );
}
