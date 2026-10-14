import * as React from 'react';

/** Ширина/высота элемента через ResizeObserver. fallback — до первого измерения и в jsdom. */
export function useElementSize<T extends HTMLElement>(fallback = { width: 0, height: 0 }) {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState(fallback);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w) setSize((s) => (s.width === w && s.height === h ? s : { width: w, height: h }));
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}
