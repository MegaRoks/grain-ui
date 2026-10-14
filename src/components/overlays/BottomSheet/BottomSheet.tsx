import * as React from 'react';
import { cx } from '../../../utils/cx';
import { usePresence } from '../../../hooks/usePresence';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { isTopLayer } from '../../../hooks/useLayer';
import { Portal } from '../../../utils/Portal';
import './BottomSheet.css';

export interface BottomSheetProps {
  open: boolean;
  /** Не задавайте, чтобы шторку нельзя было смахнуть и закрыть по scrim/Escape. */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Закреплённый низ: кнопки действий. */
  footer?: React.ReactNode;
  /** Смахивание вниз за ручку и шапку. */
  draggable?: boolean;
  /** position:absolute без портала и блокировки прокрутки — для превью внутри фрейма. */
  inline?: boolean;
  container?: Element | null;
  children?: React.ReactNode;
  className?: string;
}

const CLOSE_RATIO = 0.3;
const CLOSE_VELOCITY = 0.5; // px/ms

/**
 * Шторка снизу. Выезжает на --ease-drawer за 400ms, уходит за 160ms. Смахивается вниз:
 * закрывается, если протянуть на 30% высоты или резко дёрнуть; иначе возвращается на место.
 * Модальная: портал, focus trap, возврат фокуса, блокировка прокрутки, Escape.
 */
export function BottomSheet(props: BottomSheetProps) {
  const [present, state] = usePresence(props.open, 200);
  if (!present) return null;
  return (
    <Portal disabled={props.inline} container={props.container}>
      <SheetLayer {...props} state={state} />
    </Portal>
  );
}

function SheetLayer({ open, onClose, title, description, footer, draggable = true, inline, children, className, state }: BottomSheetProps & { state: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();
  const layer = useFocusTrap(ref, open);
  useScrollLock(open && !inline);
  const drag = React.useRef<{ y: number; t: number; dy: number; v: number } | null>(null);

  React.useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isTopLayer(layer)) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, layer]);

  const canDrag = draggable && !!onClose;
  const onPointerDown = (e: React.PointerEvent) => {
    if (!canDrag || e.button !== 0) return;
    drag.current = { y: e.clientY, t: Date.now(), dy: 0, v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    ref.current?.setAttribute('data-dragging', '');
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    const dy = e.clientY - d.y;
    const now = Date.now();
    const dt = Math.max(1, now - d.t);
    d.v = (dy - d.dy) / dt;
    d.dy = dy;
    d.t = now;
    // Вверх — с сопротивлением, вниз — 1:1.
    el.style.transform = 'translateY(' + (dy < 0 ? -Math.sqrt(-dy) * 2 : dy) + 'px)';
  };
  const onPointerUp = () => {
    const d = drag.current;
    const el = ref.current;
    drag.current = null;
    if (!d || !el) return;
    el.removeAttribute('data-dragging');
    el.style.transform = '';
    if (d.dy > el.offsetHeight * CLOSE_RATIO || d.v > CLOSE_VELOCITY) onClose?.();
  };
  const dragProps = canDrag ? { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } : {};

  return (
    <div className="gr-sheet-root" style={{ position: inline ? 'absolute' : 'fixed' }}>
      <div className="gr-scrim" data-state={state} data-testid="scrim" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={cx('gr-sheet', className)}
        data-state={state}
      >
        <div className="gr-sheet__grab" {...dragProps}>
          <span className="gr-sheet__handle" aria-hidden="true" />
          {title || description ? (
            <div className="gr-sheet__head">
              {title ? <h2 id={titleId} className="gr-sheet__title">{title}</h2> : null}
              {description ? <p id={descId} className="gr-sheet__desc">{description}</p> : null}
            </div>
          ) : null}
        </div>
        {children ? <div className="gr-sheet__body">{children}</div> : null}
        {footer ? <div className="gr-sheet__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
