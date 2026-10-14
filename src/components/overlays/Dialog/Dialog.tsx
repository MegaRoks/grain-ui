import * as React from 'react';
import { Icon } from '../../core/Icon';
import { usePresence } from '../../../hooks/usePresence';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { isTopLayer } from '../../../hooks/useLayer';
import { Portal } from '../../../utils/Portal';

export interface DialogProps {
  open: boolean;
  /** Не задавайте, чтобы диалог нельзя было закрыть (нет крестика и клика по scrim). */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Ряд действий, обычно две Button, главная — последней. */
  footer?: React.ReactNode;
  /** Максимальная ширина в px. 420 по умолчанию; 560 для форм. */
  width?: number;
  /** position:absolute без портала и без блокировки прокрутки — для превью внутри фрейма. */
  inline?: boolean;
  /** Куда рендерить портал; по умолчанию document.body. */
  container?: Element | null;
  closeLabel?: string;
  children?: React.ReactNode;
}

/**
 * Модальное окно по центру. Рендерится в портал, держит фокус внутри, возвращает его на триггер,
 * блокирует прокрутку страницы. Начальный фокус — на [data-autofocus] или на само окно.
 * Вход: opacity 0 + scale(0.96) за 260ms, выход 160ms; Escape закрывает верхний диалог.
 */
export function Dialog(props: DialogProps) {
  const [present, state] = usePresence(props.open, 200);
  if (!present) return null;
  return (
    <Portal disabled={props.inline} container={props.container}>
      <DialogLayer {...props} state={state} />
    </Portal>
  );
}

function DialogLayer({ open, onClose, title, description, footer, width = 420, inline = false, closeLabel = 'Закрыть', children, state }: DialogProps & { state: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();
  const layer = useFocusTrap(ref, open);
  useScrollLock(open && !inline);

  React.useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isTopLayer(layer)) { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, layer]);

  return (
    <div style={{ position: inline ? 'absolute' : 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <div className="gr-scrim" data-state={state} data-testid="scrim" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="gr-dialog"
        data-state={state}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        style={{ maxWidth: width, outline: 'none' }}
      >
        <div className="gr-dialog__head">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <h2 id={titleId} className="gr-dialog__title">{title}</h2>
            {onClose ? (
              <button type="button" className="gr-iconbtn gr-iconbtn--sm" aria-label={closeLabel} onClick={onClose}>
                <Icon name="x" size={14} />
              </button>
            ) : null}
          </div>
          {description ? <p id={descId} className="gr-dialog__desc">{description}</p> : null}
        </div>
        {children ? <div className="gr-dialog__body">{children}</div> : null}
        {footer ? <div className="gr-dialog__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
