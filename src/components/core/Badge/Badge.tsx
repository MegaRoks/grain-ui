import * as React from 'react';
import { cx } from '../../../utils/cx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'solid';
  /** Точка 5px слева — для live-статусов. */
  dot?: boolean;
}

/** Небольшая неинтерактивная метка статуса. */
export function Badge({ tone = 'neutral', dot, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('gr-badge', 'gr-badge--' + tone, className)} {...rest}>
      {dot ? <span className="gr-badge__dot" /> : null}
      {children}
    </span>
  );
}
