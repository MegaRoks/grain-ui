import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon, type IconSource } from '../../core/Icon';
import './ChipGroup.css';

export interface ChipOption {
  value: string;
  label: React.ReactNode;
  icon?: IconSource;
  /** Счётчик справа: сколько элементов под фильтром. */
  count?: number;
  disabled?: boolean;
}

type Common = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  options: ChipOption[];
  /** Подпись группы; без неё задайте aria-label. */
  label?: React.ReactNode;
  size?: 'sm' | 'md';
  /** scroll — одна строка с горизонтальной прокруткой (мобильные фильтры), wrap — перенос. */
  overflow?: 'wrap' | 'scroll';
  name?: string;
};
export type ChipGroupProps = Common &
  (
    | { multiple?: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void }
    | { multiple: false; value?: string; defaultValue?: string; onChange?: (value: string) => void }
  );

/**
 * Чипы-фильтры. multiple (по умолчанию) — несколько значений на нативных checkbox,
 * multiple={false} — одно значение на radio. Отметка рисуется через :checked,
 * клавиатура и формы работают из коробки.
 */
export const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(props, ref) {
  const { options, label, size = 'md', overflow = 'wrap', name, multiple = true, value, defaultValue, onChange, className, 'aria-label': ariaLabel, ...rest } = props as Common & {
    multiple?: boolean; value?: string | string[]; defaultValue?: string | string[]; onChange?: (v: never) => void;
  };
  const autoName = React.useId();
  const labelId = React.useId();
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<string[]>(() => [defaultValue ?? []].flat());
  const selected = controlled ? [value].flat() : inner;

  const toggle = (v: string, checked: boolean) => {
    const next = multiple ? (checked ? [...selected, v] : selected.filter((x) => x !== v)) : [v];
    if (!controlled) setInner(next);
    (onChange as ((x: string | string[]) => void) | undefined)?.(multiple ? next : v);
  };

  return (
    <div ref={ref} className={cx('gr-field', className)} {...rest}>
      {label ? <span id={labelId} className="gr-field__label">{label}</span> : null}
      <div
        role={multiple ? 'group' : 'radiogroup'}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        className={cx('gr-chips', overflow === 'scroll' && 'gr-chips--scroll', size === 'sm' && 'gr-chips--sm')}
      >
        {options.map((o) => (
          <label key={o.value} className={cx('gr-chip', o.disabled && 'gr-chip--disabled')}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name ?? autoName}
              value={o.value}
              disabled={o.disabled}
              checked={selected.includes(o.value)}
              onChange={(e) => toggle(o.value, e.target.checked)}
            />
            <span className="gr-chip__body">
              {multiple ? <span className="gr-chip__check" aria-hidden="true"><Icon name="check" size={12} strokeWidth={2.25} /></span> : null}
              {o.icon ? <Icon name={o.icon} size={14} /> : null}
              <span>{o.label}</span>
              {o.count !== undefined ? <span className="gr-chip__count">{o.count}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
});
