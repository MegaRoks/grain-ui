import * as React from 'react';
import { isTopLayer, useLayer } from './useLayer';

const FOCUSABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,[contenteditable="true"],[tabindex]:not([tabindex="-1"])';

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('inert') && !el.closest('[inert]'));
}

/**
 * Держит Tab/Shift+Tab внутри контейнера, пока active.
 * При активации фокусирует [data-autofocus] или сам контейнер (нужен tabIndex={-1});
 * при деактивации возвращает фокус туда, где он был до открытия.
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  const layer = useLayer(active);
  React.useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const prev = document.activeElement as HTMLElement | null;
    const auto = el.querySelector<HTMLElement>('[data-autofocus],[autofocus]');
    (auto ?? el).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !isTopLayer(layer)) return;
      const items = getFocusable(el);
      if (!items.length) { e.preventDefault(); el.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const cur = document.activeElement;
      if (e.shiftKey && (cur === first || cur === el || !el.contains(cur))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || !el.contains(cur))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [active, ref, layer]);
  return layer;
}
