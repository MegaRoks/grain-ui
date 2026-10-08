import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';

export interface TabItem { value: string; label: React.ReactNode; icon?: string; count?: number }

export interface TabsProps {
  items: Array<string | TabItem>;
  /** Значение выбранной вкладки; по умолчанию первая. */
  value?: string;
  onChange?: (value: string) => void;
  /** segmented — группа-«пилюля», underline — навигация по разделам страницы. */
  variant?: 'segmented' | 'underline';
  className?: string;
  style?: React.CSSProperties;
}

const norm = (raw: string | TabItem): TabItem => (typeof raw === 'string' ? { value: raw, label: raw } : raw);

/** Переключатель вкладок с измеряемым индикатором, скользящим на --ease-in-out. */
export function Tabs({ items, value, onChange, variant = 'segmented', className, style }: TabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [ind, setInd] = React.useState<{ left: number; width: number } | null>(null);
  const list = items.map(norm);
  const active = value ?? list[0]?.value;

  React.useLayoutEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, items, variant]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = list.findIndex((t) => t.value === active);
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
    onChange?.(next.value);
    listRef.current?.querySelector<HTMLElement>('[data-value="' + next.value + '"]')?.focus();
  };

  return (
    <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className={cx('gr-tabs', variant === 'underline' && 'gr-tabs--underline', className)} style={style}>
      {ind ? <span className="gr-tabs__ind" aria-hidden="true" style={{ transform: 'translateX(' + ind.left + 'px)', width: ind.width, left: 0 }} /> : null}
      {list.map((item) => {
        const selected = item.value === active;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-value={item.value}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="gr-tabs__tab"
            onClick={() => onChange?.(item.value)}
          >
            {item.icon ? <Icon name={item.icon} size={14} /> : null}
            {item.label}
            {item.count !== undefined ? <span style={{ color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>{item.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
