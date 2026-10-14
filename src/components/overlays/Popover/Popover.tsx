import * as React from 'react';
import { Icon, type IconSource } from '../../core/Icon';
import { usePresence } from '../../../hooks/usePresence';
import { useFloating } from '../../../hooks/useFloating';
import { useLayer, isTopLayer } from '../../../hooks/useLayer';
import { Portal } from '../../../utils/Portal';

export interface PopoverProps {
  open: boolean;
  onClose?: () => void;
  /** Якорь. По умолчанию — родитель Popover в разметке (обёртка триггера). */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Сторона относительно якоря; переворачивается, если не помещается. */
  side?: 'bottom' | 'top';
  /** К какому краю якоря прижать. */
  align?: 'left' | 'right' | 'center';
  width?: number;
  /** Переопределить transform-origin. По умолчанию вычисляется из стороны и выравнивания. */
  origin?: string;
  /** Подпись меню для скринридеров. */
  'aria-label'?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const ITEM = '[role="menuitem"]:not([disabled])';

/**
 * Якорное меню. Рендерится в портал с position:fixed — не обрезается overflow:hidden.
 * Открытие фокусирует первый пункт, ↑/↓/Home/End двигают фокус, Escape и Tab закрывают
 * и возвращают фокус на триггер. Закрытое меню скрыто visibility:hidden и inert.
 */
export function Popover({ open, onClose, anchorRef, side = 'bottom', align = 'left', width = 220, origin, children, style, ...aria }: PopoverProps) {
  const marker = React.useRef<HTMLSpanElement>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [menuEl, setMenuEl] = React.useState<HTMLDivElement | null>(null);
  const setRef = React.useCallback((n: HTMLDivElement | null) => { ref.current = n; setMenuEl(n); }, []);
  const [present, state] = usePresence(open, 180);
  const layer = useLayer(open);
  const getAnchor = React.useCallback(() => anchorRef?.current ?? marker.current?.parentElement ?? null, [anchorRef]);
  const a = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center';
  const floating = useFloating(getAnchor, menuEl, { open: present, side, align: a });

  const returnFocus = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (open) { returnFocus.current = document.activeElement as HTMLElement | null; return; }
    const active = document.activeElement;
    // inert может уже сбросить фокус на body — тоже возвращаем на триггер.
    if (ref.current && (ref.current.contains(active) || active === document.body)) returnFocus.current?.focus({ preventScroll: true });
  }, [open]);
  // inert ставим вручную: так одинаково работает в React 18 и 19.
  React.useLayoutEffect(() => { menuEl?.toggleAttribute('inert', !open); }, [open, menuEl]);
  React.useEffect(() => {
    if (open && menuEl) menuEl.querySelector<HTMLElement>(ITEM)?.focus({ preventScroll: true });
  }, [open, menuEl]);

  React.useEffect(() => {
    if (!open || !onClose) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || getAnchor()?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isTopLayer(layer)) onClose(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, onClose, getAnchor, layer]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') { e.preventDefault(); onClose?.(); return; }
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ITEM));
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'ArrowDown' ? items[(i + 1) % items.length]
        : e.key === 'ArrowUp' ? items[(i - 1 + items.length) % items.length]
          : e.key === 'Home' ? items[0]
            : e.key === 'End' ? items[items.length - 1]
              : null;
    if (next) { e.preventDefault(); next.focus(); }
  };

  return (
    <>
      <span ref={marker} hidden />
      {present ? (
        <Portal>
          <div
            ref={setRef}
            role="menu"
            aria-label={aria['aria-label']}
            aria-hidden={open ? undefined : true}
            className="gr-popover"
            data-state={state}
            onKeyDown={onKeyDown}
            style={{
              ...floating.style,
              width,
              '--transform-origin': origin || floating.origin,
              ...style,
            } as React.CSSProperties}
          >
            {children}
          </div>
        </Portal>
      ) : null}
    </>
  );
}

export interface PopoverItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconSource;
  selected?: boolean;
  shortcut?: React.ReactNode;
}

export function PopoverItem({ icon, children, selected, shortcut, type = 'button', ...rest }: PopoverItemProps) {
  return (
    <button type={type} role="menuitem" tabIndex={-1} className="gr-popover__item" aria-current={selected ? 'true' : undefined} {...rest}>
      {icon ? <Icon name={icon} size={14} /> : null}
      <span style={{ flex: 1 }}>{children}</span>
      {shortcut ? <span style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{shortcut}</span> : null}
      {selected ? <Icon name="check" size={13} /> : null}
    </button>
  );
}

export function PopoverSeparator() {
  return <div role="separator" className="gr-popover__sep" />;
}
