import * as React from 'react';
import { icons, type LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

const pascal = (n: string) => n.replace(/(^|[-_ ])(\w)/g, (_m, _s, c: string) => c.toUpperCase());

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Имя иконки Lucide в kebab- или Pascal-регистре: "arrow-right" | "ArrowRight". */
  name: IconName | (string & {});
  /** Размер в px. 14 — плотный UI, 16 — по умолчанию, 20 — крупные контролы. */
  size?: number;
  /** 1.75 — толщина Grain UI по умолчанию; не смешивайте толщины на одном экране. */
  strokeWidth?: number;
  /** Задавайте, только если иконка несёт смысл сама по себе. */
  label?: string;
}

/** Обёртка над lucide-react с дефолтами Grain UI. */
export function Icon({ name, size = 16, strokeWidth = 1.75, label, style, ...rest }: IconProps) {
  const Cmp = (icons as Record<string, React.ComponentType<LucideProps>>)[pascal(String(name))];
  if (!Cmp) return null;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={{ display: 'block', flex: 'none', ...style }}
      {...rest}
    />
  );
}
