import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon, type IconSource } from '../../core/Icon';

export interface TabItem { value: string; label: React.ReactNode; icon?: IconSource; count?: number; disabled?: boolean }

export interface TabsProps {
  items: Array<string | TabItem>;
  /** Выбранная вкладка (контролируемый режим). */
  value?: string;
  /** Начальная вкладка (неконтролируемый режим); по умолчанию первая. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** segmented — группа-«пилюля», underline — навигация по разделам страницы. */
  variant?: 'segmented' | 'underline';
  /** Базовый id. Задайте его, чтобы связать вкладки с <TabPanel tabsId={id} value=…>. */
  id?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

const norm = (raw: string | TabItem): TabItem => (typeof raw === 'string' ? { value: raw, label: raw } : raw);
const safe = (v: string) => v.replace(/\s+/g, '-');
export const tabId = (base: string, value: string) => base + '-tab-' + safe(value);
export const tabPanelId = (base: string, value: string) => base + '-panel-' + safe(value);

/**
 * Вкладки по паттерну WAI-ARIA Tabs: ←/→ с переходом по кругу, Home/End, roving tabindex.
 * Индикатор измеряется и пересчитывается при ресайзе и подгрузке шрифтов; скользит на --ease-in-out.
 */
export function Tabs({ items, value, defaultValue, onChange, variant = 'segmented', id, className, style, ...aria }: TabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const autoId = React.useId();
  const base = id ?? autoId;
  const list = items.map(norm);
  const [inner, setInner] = React.useState(defaultValue ?? list[0]?.value);
  const active = value ?? inner;
  const [ind, setInd] = React.useState<{ left: number; width: number } | null>(null);

  const select = (v: string) => { if (value === undefined) setInner(v); onChange?.(v); };

  const measure = React.useCallback(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el) return setInd(null);
    setInd((p) => (p && p.left === el.offsetLeft && p.width === el.offsetWidth ? p : { left: el.offsetLeft, width: el.offsetWidth }));
  }, []);

  React.useLayoutEffect(measure, [measure, active, items, variant]);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      el.querySelectorAll('[role="tab"]').forEach((t) => ro!.observe(t));
    }
    return () => { window.removeEventListener('resize', measure); ro?.disconnect(); };
  }, [measure, items.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const enabled = list.filter((t) => !t.disabled);
    if (!enabled.length) return;
    const i = enabled.findIndex((t) => t.value === active);
    const next =
      e.key === 'ArrowRight' ? enabled[(i + 1) % enabled.length]
        : e.key === 'ArrowLeft' ? enabled[(i - 1 + enabled.length) % enabled.length]
          : e.key === 'Home' ? enabled[0]
            : e.key === 'End' ? enabled[enabled.length - 1]
              : null;
    if (!next) return;
    e.preventDefault();
    select(next.value);
    document.getElementById(tabId(base, next.value))?.focus();
  };

  return (
    <div ref={listRef} role="tablist" aria-label={aria['aria-label']} onKeyDown={onKeyDown} className={cx('gr-tabs', variant === 'underline' && 'gr-tabs--underline', className)} style={style}>
      {ind ? <span className="gr-tabs__ind" aria-hidden="true" style={{ transform: 'translateX(' + ind.left + 'px)', width: ind.width, left: 0 }} /> : null}
      {list.map((item) => {
        const selected = item.value === active;
        return (
          <button
            key={item.value}
            id={tabId(base, item.value)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={id ? tabPanelId(base, item.value) : undefined}
            disabled={item.disabled}
            tabIndex={selected ? 0 : -1}
            className="gr-tabs__tab"
            onClick={() => select(item.value)}
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

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Тот же id, что передан в Tabs. */
  tabsId: string;
  /** value вкладки, которой принадлежит панель. */
  value: string;
}

/** Панель вкладки: role=tabpanel, связана с вкладкой через aria-labelledby. Скрывайте неактивные через hidden. */
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({ tabsId, value, ...rest }, ref) {
  return <div ref={ref} role="tabpanel" id={tabPanelId(tabsId, value)} aria-labelledby={tabId(tabsId, value)} tabIndex={0} {...rest} />;
});
