import * as React from 'react';
import { Icon } from '../../core/Icon';

const TONE = {
  info: { icon: 'info', color: 'var(--text-muted)' },
  success: { icon: 'circle-check', color: 'var(--green-500)' },
  warning: { icon: 'triangle-alert', color: 'var(--amber-500)' },
  error: { icon: 'circle-x', color: 'var(--red-500)' },
  loading: { icon: 'loader-circle', color: 'var(--text-muted)' },
} as const;

export interface ToastProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: keyof typeof TONE;
  /** Контрол справа, обычно ghost sm Button. */
  action?: React.ReactNode;
  /** false проигрывает exit-переход (держите узел ~400ms). */
  open?: boolean;
  /** Индекс в стопке: 0 — передний. Задаётся Toaster. */
  depth?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
  style?: React.CSSProperties;
}

/** Уведомление. CSS-переходы (не keyframes) — быстрые вставки перенаправляются плавно. */
export function Toast({ title, description, tone = 'info', action, open = true, depth = 0, onDismiss, dismissLabel = 'Скрыть', style }: ToastProps) {
  const t = TONE[tone] ?? TONE.info;
  return (
    <div
      className="gr-toast"
      role={tone === 'error' ? 'alert' : 'status'}
      data-state={open ? 'open' : 'closed'}
      style={{
        transform: open ? 'translateY(' + depth * -14 + 'px) scale(' + (1 - depth * 0.05) + ')' : undefined,
        opacity: open ? (depth > 2 ? 0 : 1) : undefined,
        zIndex: 10 - depth,
        ...style,
      }}
    >
      <span className="gr-toast__icon" style={{ color: t.color }}>
        <Icon name={t.icon} size={15} style={tone === 'loading' ? { animation: 'gr-spin 560ms linear infinite' } : undefined} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="gr-toast__title">{title}</div>
        {description ? <div className="gr-toast__desc">{description}</div> : null}
      </div>
      {action ? <div className="gr-toast__action">{action}</div> : null}
      {onDismiss ? (
        <button type="button" className="gr-iconbtn gr-iconbtn--sm" aria-label={dismissLabel} onClick={onDismiss}>
          <Icon name="x" size={13} />
        </button>
      ) : null}
    </div>
  );
}

export type ToastItem = ToastProps & { id: string | number };

export interface ToasterProps {
  /** Новые — первыми; у каждого нужен стабильный id. */
  toasts: ToastItem[];
  onDismiss?: (id: string | number) => void;
  /** Сколько тостов держать в DOM. */
  max?: number;
  style?: React.CSSProperties;
}

export function Toaster({ toasts, onDismiss, max = 4, style }: ToasterProps) {
  return (
    <div className="gr-toaster" aria-live="polite" style={style}>
      {toasts.slice(0, max).map((t, i) => (
        <Toast key={t.id} {...t} depth={i} open={t.open !== false} onDismiss={i === 0 && onDismiss ? () => onDismiss(t.id) : undefined} />
      ))}
    </div>
  );
}
