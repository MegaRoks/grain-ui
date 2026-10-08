import * as React from 'react';
import { Icon } from '../../core/Icon';
import { usePresence } from '../../../hooks/usePresence';

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
  /** position:absolute вместо fixed — для использования внутри фрейма. */
  inline?: boolean;
  closeLabel?: string;
  children?: React.ReactNode;
}

/** Модальное окно по центру. Вход: opacity 0 + scale(0.96) за 260ms, выход 160ms; Escape закрывает. */
export function Dialog({ open, onClose, title, description, footer, width = 420, inline = false, closeLabel = 'Закрыть', children }: DialogProps) {
  const [present, state] = usePresence(open, 200);
  const titleId = React.useId();
  React.useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!present) return null;
  return (
    <div style={{ position: inline ? 'absolute' : 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <div className="gr-scrim" data-state={state} data-testid="scrim" onClick={onClose} />
      <div className="gr-dialog" data-state={state} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} style={{ maxWidth: width }}>
        <div className="gr-dialog__head">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <h2 id={titleId} className="gr-dialog__title">{title}</h2>
            {onClose ? (
              <button type="button" className="gr-iconbtn gr-iconbtn--sm" aria-label={closeLabel} onClick={onClose}>
                <Icon name="x" size={14} />
              </button>
            ) : null}
          </div>
          {description ? <p className="gr-dialog__desc">{description}</p> : null}
        </div>
        {children ? <div className="gr-dialog__body">{children}</div> : null}
        {footer ? <div className="gr-dialog__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
