import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';
import './ColorSwatches.css';

export interface SwatchOption {
  value: string;
  /** Любой CSS-цвет: hex, oklch, var(--…). */
  color: string;
  /** Название цвета — доступное имя («Синий», «Мята»). */
  label: string;
}

export interface ColorSwatchesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SwatchOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** name для нативных radio — по умолчанию генерируется. */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Подпись группы; без неё задайте aria-label. */
  label?: React.ReactNode;
  disabled?: boolean;
}

/** Светлый цвет → тёмная галочка. Для не-hex цветов (var, oklch) — светлая с тенью. */
export function isLightColor(color: string): boolean {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return false;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5;
}

/**
 * Выбор цвета из палитры. Под капотом — нативные radio: стрелки, Tab и формы работают из коробки,
 * отметка рисуется через :checked (контролируемый и неконтролируемый режим).
 */
export const ColorSwatches = React.forwardRef<HTMLDivElement, ColorSwatchesProps>(function ColorSwatches(
  { options, value, defaultValue, onChange, name, size = 'md', label, disabled, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const autoName = React.useId();
  const labelId = React.useId();
  const groupName = name ?? autoName;
  return (
    <div ref={ref} className={cx('gr-field', className)} {...rest}>
      {label ? <span id={labelId} className="gr-field__label">{label}</span> : null}
      <div role="radiogroup" aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : ariaLabel} className={cx('gr-swatches', size !== 'md' && 'gr-swatches--' + size)}>
        {options.map((o) => (
          <label key={o.value} className={cx('gr-swatch', disabled && 'gr-swatch--disabled')} style={{ '--swatch': o.color } as React.CSSProperties}>
            <input
              type="radio"
              name={groupName}
              value={o.value}
              aria-label={o.label}
              disabled={disabled}
              {...(value !== undefined ? { checked: value === o.value, onChange: () => onChange?.(o.value) } : { defaultChecked: defaultValue === o.value, onChange: () => onChange?.(o.value) })}
            />
            <span className={cx('gr-swatch__chip', isLightColor(o.color) && 'gr-swatch__chip--light')} aria-hidden="true">
              <Icon name="check" size={size === 'sm' ? 11 : 14} strokeWidth={2.5} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
});
