import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  /** Подсказка под полем. Заменяется на error, если он задан. */
  hint?: React.ReactNode;
  /** Текст ошибки; также включает invalid-кольцо. */
  error?: React.ReactNode;
  /** Иконка Lucide слева внутри поля. */
  icon?: string;
  /** Статичный текст справа, напр. "px" или ".grain.dev". */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/** Однострочное поле с лейблом, иконкой, суффиксом и подсказкой/ошибкой. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, suffix, size = 'md', id, disabled, className, style, ...rest },
  ref,
) {
  const autoId = React.useId();
  const inputId = id || autoId;
  const hintId = inputId + '-hint';
  const hasHint = Boolean(error || hint);
  return (
    <div className="gr-field" style={style}>
      {label ? <label className="gr-field__label" htmlFor={inputId}>{label}</label> : null}
      <div className={cx('gr-input', size !== 'md' && 'gr-input--' + size, Boolean(error) && 'gr-input--invalid', disabled && 'gr-input--disabled', className)}>
        {icon ? <Icon name={icon} size={15} style={{ color: 'var(--text-subtle)' }} /> : null}
        <input
          ref={ref}
          id={inputId}
          className="gr-input__el"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasHint ? hintId : undefined}
          {...rest}
        />
        {suffix ? <span className="gr-input__affix">{suffix}</span> : null}
      </div>
      {error ? (
        <span id={hintId} className="gr-field__hint gr-field__hint--error">{error}</span>
      ) : hint ? (
        <span id={hintId} className="gr-field__hint">{hint}</span>
      ) : null}
    </div>
  );
});
