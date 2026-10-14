import * as React from 'react';

export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'center' | 'end';

export interface FloatingOptions {
  open: boolean;
  side?: FloatingSide;
  align?: FloatingAlign;
  /** Зазор между якорем и плавающим элементом, px. */
  offset?: number;
  /** Минимальный отступ от краёв окна, px. */
  padding?: number;
}

const OPPOSITE: Record<FloatingSide, FloatingSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));

/** transform-origin, указывающий на якорь, — чтобы оверлей масштабировался «из» триггера. */
export function originFor(side: FloatingSide, align: FloatingAlign): string {
  const cross = side === 'top' || side === 'bottom'
    ? (align === 'start' ? 'left' : align === 'end' ? 'right' : 'center')
    : (align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center');
  const main = OPPOSITE[side];
  return side === 'top' || side === 'bottom' ? main + ' ' + cross : cross + ' ' + main;
}

/**
 * Позиционирует элемент через position:fixed относительно якоря.
 * Переворачивается на противоположную сторону, если не помещается, и прижимается к окну,
 * поэтому не обрезается контейнерами с overflow:hidden (рендерите его в Portal).
 */
export function useFloating(
  getAnchor: () => Element | null,
  /** Сам плавающий элемент (из callback-ref/useState, чтобы хук узнал о монтировании в портал). */
  floating: HTMLElement | null,
  { open, side = 'bottom', align = 'start', offset = 6, padding = 8 }: FloatingOptions,
) {
  const [pos, setPos] = React.useState<{ top: number; left: number; side: FloatingSide } | null>(null);
  const anchorRef = React.useRef(getAnchor);
  anchorRef.current = getAnchor;

  const update = React.useCallback(() => {
    const a = anchorRef.current();
    const f = floating;
    if (!a || !f) return;
    const r = a.getBoundingClientRect();
    const w = f.offsetWidth;
    const h = f.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fits = (s: FloatingSide) =>
      s === 'bottom' ? r.bottom + offset + h <= vh - padding
        : s === 'top' ? r.top - offset - h >= padding
          : s === 'right' ? r.right + offset + w <= vw - padding
            : r.left - offset - w >= padding;
    const s = fits(side) || !fits(OPPOSITE[side]) ? side : OPPOSITE[side];
    let top: number;
    let left: number;
    if (s === 'top' || s === 'bottom') {
      top = s === 'bottom' ? r.bottom + offset : r.top - offset - h;
      left = align === 'start' ? r.left : align === 'end' ? r.right - w : r.left + r.width / 2 - w / 2;
    } else {
      left = s === 'right' ? r.right + offset : r.left - offset - w;
      top = align === 'start' ? r.top : align === 'end' ? r.bottom - h : r.top + r.height / 2 - h / 2;
    }
    left = Math.round(clamp(left, padding, Math.max(padding, vw - w - padding)));
    top = Math.round(clamp(top, padding, Math.max(padding, vh - h - padding)));
    setPos((p) => (p && p.top === top && p.left === left && p.side === s ? p : { top, left, side: s }));
  }, [floating, side, align, offset, padding]);

  React.useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      const a = anchorRef.current();
      if (a) ro.observe(a);
      if (floating) ro.observe(floating);
    }
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, [open, update, floating]);

  const placed = pos?.side ?? side;
  return {
    style: { position: 'fixed', top: pos?.top ?? 0, left: pos?.left ?? 0 } as React.CSSProperties,
    side: placed,
    origin: originFor(placed, align),
    update,
  };
}
