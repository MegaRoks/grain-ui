import * as React from 'react';
import { Icon } from '../../core/Icon';

export interface PopoverProps {
  open: boolean;
  onClose?: () => void;
  /** К какому краю триггера прижать. */
  align?: 'left' | 'right';
  width?: number;
  /** Переопределить transform-origin, напр. "bottom left" при открытии вверх. */
  origin?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Якорное меню. Масштабируется из угла триггера через --transform-origin (180ms in / 160ms out).
 * Размещайте внутри обёртки триггера с position:relative.
 */
export function Popover({ open, onClose, align = 'left', width = 220, origin, children, style }: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open || !onClose) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  return (
    <div
      ref={ref}
      role="menu"
      aria-hidden={!open}
      className="gr-popover"
      data-state={open ? 'open' : 'closed'}
      style={{
        width, top: 'calc(100% + 6px)', [align]: 0,
        '--transform-origin': origin || (align === 'right' ? 'top right' : 'top left'),
        pointerEvents: open ? 'auto' : 'none', ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export interface PopoverItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  selected?: boolean;
  shortcut?: React.ReactNode;
}

export function PopoverItem({ icon, children, selected, shortcut, type = 'button', ...rest }: PopoverItemProps) {
  return (
    <button type={type} role="menuitem" className="gr-popover__item" aria-current={selected ? 'true' : undefined} {...rest}>
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
