import * as React from 'react';
import { cx } from '../../../utils/cx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** flat — только hairline, default — shadow-sm, raised — shadow-md. */
  variant?: 'default' | 'flat' | 'raised';
  /** Hover-подъём и press-scale 0.995 — только для карточек-ссылок. */
  interactive?: boolean;
  /** Линия под шапкой. */
  divided?: boolean;
}

/** Поверхность контента: белая заливка, радиус 10px, alpha-hairline + мягкая тень. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', interactive, divided, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('gr-card', variant !== 'default' && 'gr-card--' + variant, interactive && 'gr-card--interactive', divided && 'gr-card--divided', className)}
      {...rest}
    />
  );
});

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Контролы справа, обычно IconButton. */
  actions?: React.ReactNode;
}

export function CardHeader({ title, subtitle, actions, children, className, ...rest }: CardHeaderProps) {
  return (
    <div className={cx('gr-card__header', className)} {...rest}>
      <div>
        {title ? <h3 className="gr-card__title">{title}</h3> : null}
        {subtitle ? <p className="gr-card__sub">{subtitle}</p> : null}
        {children}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 'var(--space-1)' }}>{actions}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('gr-card__body', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('gr-card__footer', className)} {...rest} />;
}
