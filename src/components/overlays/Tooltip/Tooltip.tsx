import * as React from 'react';
import { usePresence } from '../../../hooks/usePresence';
import { useFloating } from '../../../hooks/useFloating';
import { Portal } from '../../../utils/Portal';

let lastShown = 0;

export interface TooltipProps {
  content: React.ReactNode;
  /** Моноширинная подсказка клавиш, напр. "⌘K". */
  shortcut?: React.ReactNode;
  /** Предпочтительная сторона; переворачивается, если не помещается. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Задержка первого показа в ms. */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Подсказка на hover/focus. Рендерится в портал (position:fixed), не обрезается контейнерами.
 * Первый показ — через 400ms, затем 800ms соседние открываются мгновенно. Escape скрывает.
 */
export function Tooltip({ content, shortcut, side = 'top', delay = 400, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const wrap = React.useRef<HTMLSpanElement>(null);
  const [tip, setTip] = React.useState<HTMLSpanElement | null>(null);
  const id = React.useId();
  const [present, state] = usePresence(open, 140);
  const floating = useFloating(() => wrap.current, tip, { open: present, side, align: 'center' });
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    clearTimeout(timer.current);
    const quick = Date.now() - lastShown < 800;
    setInstant(quick);
    timer.current = setTimeout(() => { setOpen(true); lastShown = Date.now(); }, quick ? 0 : delay);
  };
  const hide = React.useCallback(() => { clearTimeout(timer.current); setOpen((o) => { if (o) lastShown = Date.now(); return false; }); }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hide]);

  const trigger = React.isValidElement<Record<string, unknown>>(children)
    ? React.cloneElement(children, { 'aria-describedby': open ? id : undefined })
    : children;

  return (
    <span ref={wrap} style={{ display: 'inline-flex' }} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}
      {present ? (
        <Portal>
          <span
            ref={setTip}
            id={id}
            className="gr-tooltip"
            role="tooltip"
            data-state={state}
            data-instant={instant ? '' : undefined}
            style={{ ...floating.style, '--transform-origin': floating.origin } as React.CSSProperties}
          >
            {content}
            {shortcut ? <kbd className="gr-tooltip__kbd">{shortcut}</kbd> : null}
          </span>
        </Portal>
      ) : null}
    </span>
  );
}
