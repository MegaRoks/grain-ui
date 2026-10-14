import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Skeleton.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  /** text — строка текста, rect — блок, circle — аватар. */
  shape?: 'text' | 'rect' | 'circle';
}

/** Заглушка контента на время загрузки. Мерцание отключается при prefers-reduced-motion. */
export function Skeleton({ width, height, shape = 'rect', className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx('gr-skeleton', 'gr-skeleton--' + shape, className)}
      style={{ width, height: height ?? (shape === 'text' ? '0.8em' : undefined), ...(shape === 'circle' ? { aspectRatio: '1' } : null), ...style }}
      {...rest}
    />
  );
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  /** Ширина последней строки. */
  lastLineWidth?: string;
}

export function SkeletonText({ lines = 3, lastLineWidth = '60%', className, ...rest }: SkeletonTextProps) {
  return (
    <div aria-hidden="true" className={cx('gr-skeleton-text', className)} {...rest}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} shape="text" width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'} />
      ))}
    </div>
  );
}

export interface LoadingRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean;
  /** Что показывать во время загрузки (скелетоны). */
  fallback: React.ReactNode;
  /** Сообщение для скринридеров. */
  label?: string;
}

/** Обёртка: aria-busy + скрытое объявление, пока показываются скелетоны. */
export function LoadingRegion({ loading, fallback, label = 'Загрузка', children, ...rest }: LoadingRegionProps) {
  return (
    <div aria-busy={loading} {...rest}>
      {loading ? <><span className="gr-sr-only" role="status">{label}</span>{fallback}</> : children}
    </div>
  );
}
