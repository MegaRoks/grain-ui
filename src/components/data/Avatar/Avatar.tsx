import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Avatar.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Имя — источник инициалов, alt и цвета фона. */
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  /** Точка статуса в углу. */
  status?: 'online' | 'busy' | 'offline';
}

const TONES = 5;
export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
const toneOf = (name: string) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES;

/** Аватар: картинка с откатом на инициалы, если src нет или не загрузился. Цвет фона стабилен для имени. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', shape = 'circle', status, className, ...rest },
  ref,
) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  const showImg = src && !failed;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cx('gr-avatar', 'gr-avatar--' + size, shape === 'square' && 'gr-avatar--square', !showImg && 'gr-avatar--t' + toneOf(name), className)}
      {...rest}
    >
      {showImg ? <img src={src} alt="" onError={() => setFailed(true)} /> : <span aria-hidden="true">{initials(name)}</span>}
      {status ? <span className={'gr-avatar__status gr-avatar__status--' + status} aria-hidden="true" /> : null}
    </span>
  );
});

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Сколько аватаров показать; остальные свернутся в «+N». */
  max?: number;
  size?: AvatarProps['size'];
  children: React.ReactNode;
}

export function AvatarGroup({ max = 4, size = 'sm', children, className, ...rest }: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<AvatarProps>[];
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div role="group" className={cx('gr-avatar-group', className)} {...rest}>
      {shown.map((el) => React.cloneElement(el, { size }))}
      {extra > 0 ? <span className={'gr-avatar gr-avatar--' + size + ' gr-avatar--more'} aria-label={'Ещё ' + extra}>+{extra}</span> : null}
    </div>
  );
}
