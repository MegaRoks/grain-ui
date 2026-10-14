import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: React.ReactNode;
  /** Куда рендерить; по умолчанию document.body. */
  container?: Element | null;
  /** true — рендерить на месте, без портала. */
  disabled?: boolean;
}

/** Выносит детей в document.body. На сервере ничего не рендерит (SSR-безопасно). */
export function Portal({ children, container, disabled }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (disabled) return <>{children}</>;
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}
