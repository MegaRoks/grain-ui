import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon, type IconSource } from '../../core/Icon';
import './BottomNav.css';

export interface BottomNavItem {
  value: string;
  label: string;
  icon: IconSource;
  /** Иконка активного состояния (напр. залитая версия). */
  activeIcon?: IconSource;
  href?: string;
  /** true — точка, число — счётчик (99+ при переполнении). */
  badge?: boolean | number;
}

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: BottomNavItem[];
  value: string;
  onChange?: (value: string) => void;
  /** fixed — прибит к низу окна с учётом safe-area; static — в потоке (для превью и макетов). */
  position?: 'fixed' | 'static';
  /** Компонент ссылки роутера для пунктов с href. */
  linkAs?: React.ElementType;
  label?: string;
}

/** Нижний таббар мобильного приложения: 3–5 разделов, иконка + подпись, отклик на нажатие scale. */
export const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  { items, value, onChange, position = 'fixed', linkAs: Link = 'a', label = 'Разделы', className, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={cx('gr-bottomnav', position === 'fixed' && 'gr-bottomnav--fixed', className)} {...rest}>
      <ul role="list" className="gr-bottomnav__list">
        {items.map((it) => {
          const active = it.value === value;
          const badge = it.badge === true ? <span className="gr-bottomnav__dot" /> : typeof it.badge === 'number' && it.badge > 0
            ? <span className="gr-bottomnav__count">{it.badge > 99 ? '99+' : it.badge}</span> : null;
          const srBadge = it.badge === true ? ', есть новое' : typeof it.badge === 'number' && it.badge > 0 ? ', ' + it.badge + ' новых' : '';
          const inner = (
            <>
              <span className="gr-bottomnav__icon" aria-hidden="true">
                <Icon name={active && it.activeIcon ? it.activeIcon : it.icon} size={22} strokeWidth={active ? 2 : 1.75} />
                {badge}
              </span>
              <span className="gr-bottomnav__label">{it.label}</span>
              {srBadge ? <span className="gr-sr-only">{srBadge}</span> : null}
            </>
          );
          const common = {
            className: 'gr-bottomnav__item',
            'aria-current': active ? ('page' as const) : undefined,
            onClick: () => onChange?.(it.value),
          };
          return (
            <li key={it.value}>
              {it.href ? <Link href={it.href} {...common}>{inner}</Link> : <button type="button" {...common}>{inner}</button>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
