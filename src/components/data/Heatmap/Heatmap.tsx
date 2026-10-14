import * as React from 'react';
import { cx } from '../../../utils/cx';
import './Heatmap.css';

export interface HeatmapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Матрица значений: values[строка][колонка]. null — нет данных. */
  values: Array<Array<number | null>>;
  rowLabels?: React.ReactNode[];
  /** Подписи колонок; пустые строки — чтобы показывать подпись не у каждой колонки. */
  colLabels?: React.ReactNode[];
  /** Доступное описание (обязательно). */
  label: string;
  /** Число ступеней интенсивности, кроме нулевой. */
  levels?: number;
  /** Верхняя граница шкалы; по умолчанию — максимум данных. */
  max?: number;
  /** Базовый цвет шкалы. По умолчанию var(--chart-1). */
  color?: string;
  /** Сторона ячейки в px. Без неё ячейки растягиваются на ширину контейнера. */
  cellSize?: number;
  /** Текст подсказки и строки скрытой таблицы для ячейки. */
  cellLabel?: (value: number | null, row: number, col: number) => string;
  /** Показать легенду «меньше — больше». */
  legend?: boolean;
  lessLabel?: string;
  moreLabel?: string;
}

export const levelOf = (v: number | null, max: number, levels: number) =>
  v == null || v <= 0 || max <= 0 ? 0 : Math.min(levels, Math.ceil((v / max) * levels));

/**
 * Тепловая карта: интенсивность — через color-mix от базового цвета к --surface-inset, поэтому
 * работает в обеих темах. Наведение и стрелки показывают значение; данные продублированы скрытой таблицей.
 */
export function Heatmap({
  values, rowLabels, colLabels, label, levels = 4, max, color = 'var(--chart-1)', cellSize, cellLabel,
  legend = true, lessLabel = 'Меньше', moreLabel = 'Больше', className, style, ...rest
}: HeatmapProps) {
  const rows = values.length;
  const cols = Math.max(0, ...values.map((r) => r.length));
  const top = max ?? Math.max(0, ...values.flat().map((v) => v ?? 0));
  const [active, setActive] = React.useState<[number, number] | null>(null);
  const [tipPos, setTipPos] = React.useState<{ left: number; top: number } | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const fmt = cellLabel ?? ((v: number | null) => (v == null ? 'нет данных' : String(v)));

  React.useLayoutEffect(() => {
    if (!active || !gridRef.current) return setTipPos(null);
    const el = gridRef.current.querySelector<HTMLElement>('[data-cell="' + active[0] + '-' + active[1] + '"]');
    if (el) setTipPos({ left: el.offsetLeft + el.offsetWidth / 2, top: el.offsetTop });
  }, [active]);

  const move = (dr: number, dc: number) =>
    setActive((a) => {
      const [r, c] = a ?? [0, 0];
      return [Math.max(0, Math.min(rows - 1, r + dr)), Math.max(0, Math.min(cols - 1, c + dc))];
    });
  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (map[e.key]) { e.preventDefault(); move(...map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); setActive((a) => [a?.[0] ?? 0, 0]); }
    else if (e.key === 'End') { e.preventDefault(); setActive((a) => [a?.[0] ?? 0, cols - 1]); }
  };

  const track = cellSize ? cellSize + 'px' : 'minmax(0, 1fr)';
  const hasRowLabels = !!rowLabels?.length;
  const fill = (lvl: number) => (lvl === 0 ? undefined : 'color-mix(in oklab, ' + color + ' ' + Math.round((lvl / levels) * 100) + '%, var(--surface-inset))');

  return (
    <div className={cx('gr-heatmap', className)} style={style} {...rest}>
      <div className="gr-heatmap__plot">
        <div
          ref={gridRef}
          role="img"
          aria-label={label}
          tabIndex={0}
          className="gr-heatmap__grid"
          style={{ gridTemplateColumns: (hasRowLabels ? 'auto ' : '') + 'repeat(' + cols + ', ' + track + ')' }}
          onKeyDown={onKeyDown}
          onFocus={() => setActive((a) => a ?? [0, cols - 1])}
          onBlur={() => setActive(null)}
          onPointerLeave={() => setActive(null)}
        >
          {colLabels ? (
            <>
              {hasRowLabels ? <span /> : null}
              {Array.from({ length: cols }, (_, c) => <span key={'c' + c} className="gr-heatmap__col" aria-hidden="true">{colLabels[c]}</span>)}
            </>
          ) : null}
          {values.map((row, r) => (
            <React.Fragment key={r}>
              {hasRowLabels ? <span className="gr-heatmap__row" aria-hidden="true">{rowLabels![r]}</span> : null}
              {Array.from({ length: cols }, (_, c) => {
                const v = row[c] ?? null;
                const lvl = levelOf(v, top, levels);
                const isActive = active?.[0] === r && active?.[1] === c;
                return (
                  <span
                    key={c}
                    data-cell={r + '-' + c}
                    data-level={lvl}
                    data-empty={v == null || undefined}
                    data-active={isActive || undefined}
                    className="gr-heatmap__cell"
                    style={{ background: fill(lvl), width: cellSize, height: cellSize }}
                    onPointerEnter={() => setActive([r, c])}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {active && tipPos ? (
          <div className="gr-heatmap__tip" role="status" style={{ left: tipPos.left, top: tipPos.top }}>
            {fmt(values[active[0]]?.[active[1]] ?? null, active[0], active[1])}
          </div>
        ) : null}
      </div>
      {legend ? (
        <div className="gr-heatmap__legend" aria-hidden="true">
          <span>{lessLabel}</span>
          {Array.from({ length: levels + 1 }, (_, l) => <i key={l} style={{ background: fill(l) }} />)}
          <span>{moreLabel}</span>
        </div>
      ) : null}
      <table className="gr-sr-only">
        <caption>{label}</caption>
        <tbody>
          {values.map((row, r) => (
            <tr key={r}>
              <th scope="row">{rowLabels?.[r] ?? r + 1}</th>
              {Array.from({ length: cols }, (_, c) => <td key={c}>{fmt(row[c] ?? null, r, c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CalendarDay { date: Date | string; value: number }

export interface CalendarHeatmapProps extends Omit<HeatmapProps, 'values' | 'rowLabels' | 'colLabels' | 'cellLabel'> {
  days: CalendarDay[];
  /** Формат подсказки; по умолчанию «12 окт: 4». */
  dayLabel?: (date: Date, value: number | null) => string;
  locale?: string;
}

/** 'YYYY-MM-DD' — как локальная дата, без сдвига часового пояса. */
const toDate = (d: Date | string) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day); }
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
};
const iso = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

/** Раскладывает дни в недели: колонки — недели (с понедельника), строки — дни недели. */
export function calendarMatrix(days: CalendarDay[], locale = 'ru') {
  if (!days.length) return { values: [] as (number | null)[][], dates: [] as (Date | null)[][], colLabels: [] as string[] };
  const byDay = new Map(days.map((d) => [iso(toDate(d.date)), d.value] as const));
  const sorted = days.map((d) => toDate(d.date)).sort((a, b) => a.getTime() - b.getTime());
  const start = new Date(sorted[0]);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = sorted[sorted.length - 1];
  const values: (number | null)[][] = Array.from({ length: 7 }, () => []);
  const dates: (Date | null)[][] = Array.from({ length: 7 }, () => []);
  const colLabels: string[] = [];
  const month = new Intl.DateTimeFormat(locale, { month: 'short' });
  let lastMonth = -1;
  for (const cur = new Date(start); cur <= end || (cur.getDay() + 6) % 7 !== 0; cur.setDate(cur.getDate() + 1)) {
    const row = (cur.getDay() + 6) % 7;
    if (row === 0) {
      colLabels.push(cur.getMonth() !== lastMonth ? month.format(cur).replace('.', '') : '');
      lastMonth = cur.getMonth();
    }
    const inRange = cur >= sorted[0] && cur <= end;
    values[row].push(inRange ? byDay.get(iso(cur)) ?? 0 : null);
    dates[row].push(inRange ? new Date(cur) : null);
  }
  return { values, dates, colLabels };
}

/** Календарная тепловая карта активности (как у контрибьюций): недели × дни недели. */
export function CalendarHeatmap({ days, dayLabel, locale = 'ru', cellSize = 12, ...rest }: CalendarHeatmapProps) {
  const { values, dates, colLabels } = React.useMemo(() => calendarMatrix(days, locale), [days, locale]);
  const dayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }), [locale]);
  const fmt = dayLabel ?? ((d: Date, v: number | null) => dayFmt.format(d) + ': ' + (v ?? 0));
  return (
    <Heatmap
      {...rest}
      cellSize={cellSize}
      values={values}
      colLabels={colLabels}
      rowLabels={['Пн', '', 'Ср', '', 'Пт', '', '']}
      cellLabel={(v, r, c) => { const d = dates[r]?.[c]; return d ? fmt(d, v) : 'вне периода'; }}
    />
  );
}
