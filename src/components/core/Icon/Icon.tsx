import * as React from 'react';
import {
  Check, X, ChevronDown, ChevronUp, ChevronRight, ChevronsUpDown, Info,
  CircleCheck, TriangleAlert, CircleX, LoaderCircle, Menu,
  type LucideProps,
} from 'lucide-react';

export type IconComponent = React.ComponentType<LucideProps>;
/** Имя зарегистрированной иконки ("arrow-right" | "ArrowRight") или сам компонент из lucide-react. */
export type IconSource = string | IconComponent;

const pascal = (n: string) => n.replace(/(^|[-_ ])(\w)/g, (_m, _s, c: string) => c.toUpperCase());

/** Только иконки, которые нужны самому киту. Остальные подключаются через registerIcons. */
const registry: Record<string, IconComponent> = {
  Check, X, ChevronDown, ChevronUp, ChevronRight, ChevronsUpDown, Info,
  CircleCheck, TriangleAlert, CircleX, LoaderCircle, Menu,
};
const warned = new Set<string>();

/**
 * Регистрирует иконки для использования по имени. В бандл попадают только переданные:
 *   import { Rocket, Settings } from 'lucide-react';
 *   registerIcons({ Rocket, Settings });
 */
export function registerIcons(map: Record<string, IconComponent>) {
  for (const [k, v] of Object.entries(map)) registry[pascal(k)] = v;
}

export interface IconProps extends Omit<LucideProps, 'ref' | 'name'> {
  /** Имя зарегистрированной иконки или компонент lucide-react: name={Rocket}. */
  name: IconSource;
  /** Размер в px. 14 — плотный UI, 16 — по умолчанию, 20 — крупные контролы. */
  size?: number;
  /** 1.75 — толщина Grain UI по умолчанию; не смешивайте толщины на одном экране. */
  strokeWidth?: number;
  /** Задавайте, только если иконка несёт смысл сама по себе. */
  label?: string;
}

/** Обёртка над lucide-react с дефолтами Grain UI. Не тянет весь набор иконок. */
export function Icon({ name, size = 16, strokeWidth = 1.75, label, style, ...rest }: IconProps) {
  const Cmp = typeof name === 'string' ? registry[pascal(name)] : name;
  if (!Cmp) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && !warned.has(String(name))) {
      warned.add(String(name));
      console.warn('[grain-ui] Иконка "' + String(name) + '" не зарегистрирована. Добавьте registerIcons({ ' + pascal(String(name)) + " }) из 'lucide-react' или передайте компонент: name={" + pascal(String(name)) + '}.');
    }
    return null;
  }
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
