import * as React from 'react';
import { cx } from '../../../utils/cx';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { isTopLayer } from '../../../hooks/useLayer';
import { IconButton } from '../../core/IconButton';
import './AppShell.css';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Обычно <Sidebar>. На узких экранах (<768px) становится выезжающей панелью. */
  sidebar?: React.ReactNode;
  /** Верхняя панель над контентом. */
  header?: React.ReactNode;
  /** Открыта ли панель на мобильных. На десктопе игнорируется. */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Ограничить ширину контента токеном --page-max. */
  contained?: boolean;
  /** Подпись кнопки меню, которая появляется в шапке на мобильных. */
  menuLabel?: string;
}

const MOBILE = '(max-width: 767px)';
const useMedia = (q: string) => {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches;
  const [m, setM] = React.useState(get);
  React.useEffect(() => {
    const mq = window.matchMedia?.(q);
    if (!mq) return;
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
};

/** Каркас дашборда: сайдбар + шапка + прокручиваемый контент. Ссылка «К содержимому» для клавиатуры. */
export function AppShell({ sidebar, header, sidebarOpen = false, onSidebarOpenChange, contained, menuLabel = 'Открыть меню', children, className, ...rest }: AppShellProps) {
  const mobile = useMedia(MOBILE);
  const drawer = mobile && sidebarOpen;
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mainId = React.useId();
  const layer = useFocusTrap(panelRef, drawer);
  useScrollLock(drawer);
  // inert ставим вручную: одинаково в React 18 и 19.
  React.useLayoutEffect(() => { panelRef.current?.toggleAttribute('inert', mobile && !drawer); }, [mobile, drawer]);
  React.useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isTopLayer(layer)) onSidebarOpenChange?.(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer, layer, onSidebarOpenChange]);

  return (
    <div className={cx('gr-shell', className)} data-mobile={mobile || undefined} {...rest}>
      <a className="gr-shell__skip" href={'#' + mainId}>К содержимому</a>
      {sidebar ? (
        <>
          <div className="gr-shell__scrim" data-state={drawer ? 'open' : 'closed'} onClick={() => onSidebarOpenChange?.(false)} aria-hidden="true" />
          <div
            ref={panelRef}
            className="gr-shell__sidebar"
            data-state={!mobile || drawer ? 'open' : 'closed'}
            tabIndex={-1}
            role={drawer ? 'dialog' : undefined}
            aria-modal={drawer || undefined}
            aria-label={drawer ? 'Навигация' : undefined}
          >
            {sidebar}
          </div>
        </>
      ) : null}
      <div className="gr-shell__body">
        {header || (mobile && sidebar) ? (
          <header className="gr-shell__header">
            {mobile && sidebar ? <IconButton icon="menu" label={menuLabel} aria-expanded={drawer} onClick={() => onSidebarOpenChange?.(true)} /> : null}
            {header}
          </header>
        ) : null}
        <main id={mainId} tabIndex={-1} className={cx('gr-shell__main', contained && 'gr-shell__main--contained')}>{children}</main>
      </div>
    </div>
  );
}
