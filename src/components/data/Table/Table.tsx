import * as React from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../core/Icon';
import { Checkbox } from '../../forms/Checkbox';
import { Skeleton } from '../../feedback/Skeleton';
import './Table.css';

type Key = string | number;
export type SortDirection = 'asc' | 'desc';
export interface SortState { key: string; direction: SortDirection }

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Содержимое ячейки. По умолчанию — String(row[key]). */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Значение для сортировки. По умолчанию — row[key]. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  sortable?: boolean;
  /** Числа и суммы — вправо. */
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Стабильный ключ строки: имя поля или функция. */
  rowKey: keyof T | ((row: T) => Key);
  /** Подпись таблицы для скринридеров (обязательно, если на странице несколько таблиц). */
  caption?: React.ReactNode;
  /** Контролируемая сортировка. */
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** true — строки уже отсортированы снаружи (сервером); таблица только показывает состояние. */
  manualSort?: boolean;
  /** Выбор строк: включает колонку чекбоксов. */
  selectedKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;
  loading?: boolean;
  loadingRows?: number;
  /** Что показать, если строк нет. */
  empty?: React.ReactNode;
  density?: 'compact' | 'default';
  /** Высота области прокрутки; шапка залипает. */
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
  selectAllLabel?: string;
  selectRowLabel?: (row: T) => string;
}

const collator = typeof Intl !== 'undefined' ? new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }) : null;
function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
}

/**
 * Таблица данных: сортировка (aria-sort), выбор строк, скелетоны при загрузке, пустое состояние,
 * залипающая шапка и горизонтальная прокрутка на узких экранах.
 */
export function Table<T>({
  columns, rows, rowKey, caption, sort, defaultSort = null, onSortChange, manualSort,
  selectedKeys, onSelectionChange, loading, loadingRows = 5, empty = 'Нет данных',
  density = 'default', maxHeight, className, style,
  selectAllLabel = 'Выбрать все', selectRowLabel = () => 'Выбрать строку',
}: TableProps<T>) {
  const [innerSort, setInnerSort] = React.useState<SortState | null>(defaultSort);
  const activeSort = sort !== undefined ? sort : innerSort;
  const keyOf = React.useCallback((r: T): Key => (typeof rowKey === 'function' ? rowKey(r) : (r[rowKey] as unknown as Key)), [rowKey]);
  const selectable = !!onSelectionChange;
  const selected = React.useMemo(() => new Set(selectedKeys ?? []), [selectedKeys]);

  const sorted = React.useMemo(() => {
    if (!activeSort || manualSort) return rows;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return rows;
    const get = col.sortValue ?? ((r: T) => (r as Record<string, unknown>)[col.key] as string);
    const dir = activeSort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => compare(get(a), get(b)) * dir);
  }, [rows, columns, activeSort, manualSort]);

  const toggleSort = (key: string) => {
    const next: SortState | null =
      activeSort?.key !== key ? { key, direction: 'asc' }
        : activeSort.direction === 'asc' ? { key, direction: 'desc' }
          : null;
    if (sort === undefined) setInnerSort(next);
    onSortChange?.(next);
  };

  const allKeys = sorted.map(keyOf);
  const selCount = allKeys.filter((k) => selected.has(k)).length;
  const allSelected = allKeys.length > 0 && selCount === allKeys.length;
  const headRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (headRef.current) headRef.current.indeterminate = selCount > 0 && !allSelected; }, [selCount, allSelected]);

  const toggleAll = () => onSelectionChange?.(allSelected ? [] : allKeys);
  const toggleRow = (k: Key) => onSelectionChange?.(selected.has(k) ? [...selected].filter((x) => x !== k) : [...selected, k]);

  const colCount = columns.length + (selectable ? 1 : 0);
  const captionId = React.useId();

  return (
    <div
      className={cx('gr-table-wrap', className)}
      style={{ maxHeight, ...style }}
      role="region"
      aria-labelledby={caption ? captionId : undefined}
      tabIndex={0}
    >
      <table className={cx('gr-table', density === 'compact' && 'gr-table--compact')} aria-busy={loading || undefined}>
        {caption ? <caption id={captionId} className="gr-sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th className="gr-table__check" scope="col">
                <Checkbox ref={headRef} aria-label={selectAllLabel} checked={allSelected} onChange={toggleAll} disabled={loading || !allKeys.length} />
              </th>
            ) : null}
            {columns.map((c) => {
              const dir = activeSort?.key === c.key ? activeSort.direction : null;
              return (
                <th
                  key={c.key}
                  scope="col"
                  style={{ width: c.width, textAlign: c.align }}
                  aria-sort={c.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}
                >
                  {c.sortable ? (
                    <button type="button" className="gr-table__sort" data-active={dir ? '' : undefined} onClick={() => toggleSort(c.key)}>
                      {c.header}
                      <Icon name={dir === 'asc' ? 'chevron-up' : dir === 'desc' ? 'chevron-down' : 'chevrons-up-down'} size={12} />
                    </button>
                  ) : c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, i) => (
              <tr key={'s' + i} aria-hidden="true">
                {selectable ? <td className="gr-table__check" /> : null}
                {columns.map((c, j) => (
                  <td key={c.key} style={{ textAlign: c.align }}>
                    <Skeleton shape="text" width={j === 0 ? '70%' : '45%'} style={{ display: 'inline-block' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr><td colSpan={colCount} className="gr-table__empty">{empty}</td></tr>
          ) : (
            sorted.map((row, i) => {
              const k = keyOf(row);
              const isSel = selected.has(k);
              return (
                <tr key={k} aria-selected={selectable ? isSel : undefined} data-selected={isSel || undefined}>
                  {selectable ? (
                    <td className="gr-table__check">
                      <Checkbox aria-label={selectRowLabel(row)} checked={isSel} onChange={() => toggleRow(k)} />
                    </td>
                  ) : null}
                  {columns.map((c) => (
                    <td key={c.key} style={{ textAlign: c.align }}>
                      {c.cell ? c.cell(row, i) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
