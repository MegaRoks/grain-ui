import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon, type IconSource } from '../../core/Icon';
import './Sidebar.css';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Верх: логотип, переключатель проекта. */
  header?: React.ReactNode;
  /** Низ: профиль, настройки. */
  footer?: React.ReactNode;
  /** Доступное имя навигации. */
  label?: string;
}

/** Вертикальная навигация приложения. Обычно передаётся в AppShell через sidebar. */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { header, footer, label = 'Основная навигация', children, className, ...rest },
  ref,
) {
  return (
    <aside ref={ref} className={cx('gr-sidebar', className)} {...rest}>
      {header ? <div className="gr-sidebar__header">{header}</div> : null}
      <nav aria-label={label} className="gr-sidebar__nav">{children}</nav>
      {footer ? <div className="gr-sidebar__footer">{footer}</div> : null}
    </aside>
  );
});

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export function SidebarSection({ label, children, className, ...rest }: SidebarSectionProps) {
  const id = React.useId();
  return (
    <div className={cx('gr-sidebar__section', className)} {...rest}>
      {label ? <div id={id} className="gr-sidebar__label">{label}</div> : null}
      <ul role="list" aria-labelledby={label ? id : undefined} className="gr-sidebar__list">{children}</ul>
    </div>
  );
}

type NavItemBase = {
  icon?: IconSource;
  /** Текущая страница: подсветка и aria-current="page". */
  active?: boolean;
  /** Счётчик справа. */
  count?: React.ReactNode;
  /** Произвольный элемент справа (Badge, шорткат). */
  trailing?: React.ReactNode;
  children: React.ReactNode;
  /** Компонент ссылки роутера (напр. Link из Next.js) — получит href и остальные пропсы. */
  linkAs?: React.ElementType;
};
export type NavItemProps = NavItemBase &
  (({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>) |
   ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>));

/** Пункт навигации: ссылка, если задан href (linkAs — ссылка роутера), иначе кнопка. */
export function NavItem({ icon, active, count, trailing, linkAs: Link = 'a', children, className, ...rest }: NavItemProps) {
  const inner = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span className="gr-navitem__text">{children}</span>
      {count !== undefined ? <span className="gr-navitem__count">{count}</span> : null}
      {trailing}
    </>
  );
  const cls = cx('gr-navitem', className);
  return (
    <li>
      {'href' in rest && rest.href !== undefined ? (
        <Link className={cls} aria-current={active ? 'page' : undefined} {...rest}>{inner}</Link>
      ) : (
        <button type="button" className={cls} aria-current={active ? 'page' : undefined} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{inner}</button>
      )}
    </li>
  );
}
