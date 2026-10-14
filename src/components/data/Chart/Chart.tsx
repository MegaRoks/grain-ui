import * as React from 'react';
import { cx } from '../../../utils/cx';
import { useElementSize } from '../../../hooks/useElementSize';
import './Chart.css';

export interface ChartSeries {
  key: string;
  label: string;
  /** CSS-цвет; по умолчанию — var(--chart-N) по порядку. */
  color?: string;
}

type Datum = Record<string, unknown>;

interface BaseChartProps<T extends Datum> {
  data: T[];
  /** Ключ подписи по оси X. */
  x: keyof T & string;
  series: ChartSeries[];
  height?: number;
  /** Формат значений по Y и в подсказке. */
  valueFormat?: (v: number) => string;
  /** Формат подписей по X. */
  xFormat?: (v: unknown) => string;
  /** Доступное описание графика (обязательно). */
  label: string;
  /** Показать легенду. По умолчанию — если серий больше одной. */
  legend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const compact = typeof Intl !== 'undefined' ? new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 }) : null;
const defaultFormat = (v: number) => (compact ? compact.format(v) : String(v));
export const seriesColor = (s: ChartSeries, i: number) => s.color ?? 'var(--chart-' + ((i % 5) + 1) + ')';

/** «Красивые» деления оси: шаг 1/2/2.5/5·10ⁿ. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (!isFinite(min) || !isFinite(max)) return [0, 1];
  if (max === min) max = min + 1;
  const raw = (max - min) / count;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
  return out;
}

const M = { top: 8, right: 8, bottom: 24, left: 44 };

function useChart<T extends Datum>(p: BaseChartProps<T>, band: boolean) {
  const [ref, size] = useElementSize<HTMLDivElement>({ width: 600, height: 0 });
  const [active, setActive] = React.useState<number | null>(null);
  const n = p.data.length;
  const values = p.data.flatMap((d) => p.series.map((s) => Number(d[s.key]))).filter((v) => isFinite(v));
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values));
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const W = Math.max(size.width, 120);
  const H = p.height ?? 240;
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const sy = (v: number) => M.top + ih - ((v - y0) / (y1 - y0)) * ih;
  const bw = n ? iw / n : iw;
  const sx = (i: number) => (band ? M.left + bw * i + bw / 2 : M.left + (n > 1 ? (iw * i) / (n - 1) : iw / 2));
  const fmt = p.valueFormat ?? defaultFormat;
  const xf = p.xFormat ?? ((v: unknown) => String(v));
  const xEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(iw / 64))));

  const indexAt = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left - M.left;
    const i = band ? Math.floor(px / bw) : Math.round((px / iw) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  };
  const handlers = {
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => n && setActive(indexAt(e.clientX, e.currentTarget.getBoundingClientRect())),
    onPointerLeave: () => setActive(null),
    onBlur: () => setActive(null),
    onFocus: () => setActive((a) => a ?? (n ? n - 1 : null)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!n) return;
      const next = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(n - 1); }
      else if (next) { e.preventDefault(); setActive((a) => Math.max(0, Math.min(n - 1, (a ?? 0) + next))); }
    },
  };

  const showLegend = p.legend ?? p.series.length > 1;
  const legend = showLegend ? (
    <div className="gr-chart__legend" aria-hidden="true">
      {p.series.map((s, i) => <span key={s.key}><i style={{ background: seriesColor(s, i) }} />{s.label}</span>)}
    </div>
  ) : null;

  const grid = (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t}>
          <line className="gr-chart__grid" x1={M.left} x2={W - M.right} y1={sy(t)} y2={sy(t)} />
          <text className="gr-chart__tick" x={M.left - 8} y={sy(t)} dy="0.32em" textAnchor="end">{fmt(t)}</text>
        </g>
      ))}
      {p.data.map((d, i) => (i % xEvery === 0 ? (
        <text key={i} className="gr-chart__tick" x={sx(i)} y={H - 6} textAnchor={band ? 'middle' : i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>{xf(d[p.x])}</text>
      ) : null))}
    </g>
  );

  const tip = active !== null && p.data[active] ? (
    <div
      className="gr-chart__tip"
      role="status"
      style={{ left: Math.min(Math.max(sx(active), 80), W - 80), top: M.top }}
    >
      <div className="gr-chart__tip-x">{xf(p.data[active][p.x])}</div>
      {p.series.map((s, i) => (
        <div key={s.key} className="gr-chart__tip-row">
          <i style={{ background: seriesColor(s, i) }} />
          <span>{s.label}</span>
          <b>{fmt(Number(p.data[active][s.key]))}</b>
        </div>
      ))}
    </div>
  ) : null;

  const srTable = (
    <table className="gr-sr-only">
      <caption>{p.label}</caption>
      <thead><tr><th scope="col">{p.x}</th>{p.series.map((s) => <th key={s.key} scope="col">{s.label}</th>)}</tr></thead>
      <tbody>{p.data.map((d, i) => <tr key={i}><th scope="row">{xf(d[p.x])}</th>{p.series.map((s) => <td key={s.key}>{fmt(Number(d[s.key]))}</td>)}</tr>)}</tbody>
    </table>
  );

  return { ref, W, H, sx, sy, y0, bw, ih, active, handlers, legend, grid, tip, srTable };
}

export interface LineChartProps<T extends Datum> extends BaseChartProps<T> {
  /** Заливка под линией (для одной серии выглядит лучше всего). */
  area?: boolean;
}

/** Линейный график для временных рядов. Наведение и ←/→ показывают значения; данные продублированы скрытой таблицей. */
export function LineChart<T extends Datum>(props: LineChartProps<T>) {
  const c = useChart(props, false);
  const { data, series, area, className, style, label } = props;
  const gradId = React.useId().replace(/:/g, '');
  return (
    <div className={cx('gr-chart', className)} style={style}>
      {c.legend}
      <div ref={c.ref} className="gr-chart__plot">
        <svg width={c.W} height={c.H} role="img" aria-label={label} tabIndex={0} className="gr-chart__svg" {...c.handlers}>
          {c.grid}
          {series.map((s, si) => {
            const pts = data.map((d, i) => [c.sx(i), c.sy(Number(d[s.key]))] as const).filter(([, y]) => isFinite(y));
            if (!pts.length) return null;
            const line = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('');
            const color = seriesColor(s, si);
            return (
              <g key={s.key} aria-hidden="true">
                {area ? (
                  <>
                    <defs>
                      <linearGradient id={gradId + si} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" style={{ stopColor: color, stopOpacity: 0.18 }} />
                        <stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path d={line + 'L' + pts[pts.length - 1][0] + ' ' + c.sy(c.y0) + 'L' + pts[0][0] + ' ' + c.sy(c.y0) + 'Z'} fill={'url(#' + gradId + si + ')'} />
                  </>
                ) : null}
                <path d={line} className="gr-chart__line" style={{ stroke: color }} />
              </g>
            );
          })}
          {c.active !== null ? (
            <g aria-hidden="true">
              <line className="gr-chart__cursor" x1={c.sx(c.active)} x2={c.sx(c.active)} y1={8} y2={c.H - 24} />
              {series.map((s, si) => {
                const v = Number(data[c.active!][s.key]);
                return isFinite(v) ? <circle key={s.key} className="gr-chart__dot" cx={c.sx(c.active!)} cy={c.sy(v)} r={3.5} style={{ fill: seriesColor(s, si) }} /> : null;
              })}
            </g>
          ) : null}
        </svg>
        {c.tip}
      </div>
      {c.srTable}
    </div>
  );
}

/** Столбчатая диаграмма для сравнения категорий. Несколько серий рисуются группами. */
export function BarChart<T extends Datum>(props: BaseChartProps<T>) {
  const c = useChart(props, true);
  const { data, series, className, style, label } = props;
  const groupW = c.bw * 0.68;
  const gap = series.length > 1 ? 2 : 0;
  const barW = Math.max(2, (groupW - gap * (series.length - 1)) / series.length);
  return (
    <div className={cx('gr-chart', className)} style={style}>
      {c.legend}
      <div ref={c.ref} className="gr-chart__plot">
        <svg width={c.W} height={c.H} role="img" aria-label={label} tabIndex={0} className="gr-chart__svg" {...c.handlers}>
          {c.grid}
          {c.active !== null ? <rect aria-hidden="true" className="gr-chart__band" x={c.sx(c.active) - c.bw / 2} y={8} width={c.bw} height={c.ih} /> : null}
          <g aria-hidden="true">
            {data.map((d, i) => series.map((s, si) => {
              const v = Number(d[s.key]);
              if (!isFinite(v)) return null;
              const y = c.sy(Math.max(v, 0));
              const h = Math.abs(c.sy(v) - c.sy(0));
              const x = c.sx(i) - groupW / 2 + si * (barW + gap);
              return <rect key={i + s.key} className="gr-chart__bar" x={x} y={y} width={barW} height={Math.max(h, 1)} rx={Math.min(3, barW / 2)} style={{ fill: seriesColor(s, si) }} />;
            }))}
          </g>
        </svg>
        {c.tip}
      </div>
      {c.srTable}
    </div>
  );
}

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  area?: boolean;
  /** Доступное описание, напр. «Запросы за 7 дней: рост 12%». */
  label: string;
}

/** Мини-график тренда для KPI-карточек и строк таблиц. */
export function Sparkline({ data, width = 96, height = 28, color = 'var(--chart-1)', area = true, label, className, ...rest }: SparklineProps) {
  const id = React.useId().replace(/:/g, '');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = 2;
  const sx = (i: number) => pad + (data.length > 1 ? ((width - pad * 2) * i) / (data.length - 1) : (width - pad * 2) / 2);
  const sy = (v: number) => pad + (height - pad * 2) * (1 - (max === min ? 0.5 : (v - min) / (max - min)));
  const d = data.map((v, i) => (i ? 'L' : 'M') + sx(i).toFixed(1) + ' ' + sy(v).toFixed(1)).join('');
  return (
    <svg width={width} height={height} role="img" aria-label={label} className={cx('gr-sparkline', className)} {...rest}>
      {area && data.length > 1 ? (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: color, stopOpacity: 0.2 }} />
              <stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={d + 'L' + sx(data.length - 1) + ' ' + height + 'L' + sx(0) + ' ' + height + 'Z'} fill={'url(#' + id + ')'} />
        </>
      ) : null}
      <path d={d} fill="none" style={{ stroke: color }} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
