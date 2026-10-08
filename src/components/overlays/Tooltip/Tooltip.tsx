import * as React from 'react';

let lastShown = 0;

export interface TooltipProps {
  content: React.ReactNode;
  /** Моноширинная подсказка клавиш, напр. "⌘K". */
  shortcut?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Задержка первого показа в ms. */
  delay?: number;
  children: React.ReactNode;
}

const POS: Record<NonNullable<TooltipProps['side']>, React.CSSProperties> = {
  top: { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', '--transform-origin': 'bottom center' } as React.CSSProperties,
  bottom: { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', '--transform-origin': 'top center' } as React.CSSProperties,
  left: { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)', '--transform-origin': 'right center' } as React.CSSProperties,
  right: { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)', '--transform-origin': 'left center' } as React.CSSProperties,
};

/** Подсказка на hover/focus. Первый показ — через 400ms, затем 800ms открывается мгновенно. */
export function Tooltip({ content, shortcut, side = 'top', delay = 400, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const id = React.useId();
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    const quick = Date.now() - lastShown < 800;
    setInstant(quick);
    timer.current = setTimeout(() => { setOpen(true); lastShown = Date.now(); }, quick ? 0 : delay);
  };
  const hide = () => { clearTimeout(timer.current); if (open) lastShown = Date.now(); setOpen(false); };

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} aria-describedby={open ? id : undefined}
      onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      <span id={id} className="gr-tooltip" role="tooltip" data-state={open ? 'open' : 'closed'} data-instant={instant ? '' : undefined}
        style={{ ...POS[side], opacity: open ? undefined : 0 }}>
        {content}
        {shortcut ? <kbd className="gr-tooltip__kbd">{shortcut}</kbd> : null}
      </span>
    </span>
  );
}
