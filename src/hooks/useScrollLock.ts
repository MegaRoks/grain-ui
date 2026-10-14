import * as React from 'react';

let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/** Блокирует прокрутку body, компенсируя ширину скроллбара. Вложенные блокировки считаются. */
export function useScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const body = document.body;
    if (locks === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth;
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      body.style.overflow = 'hidden';
      if (gap > 0) body.style.paddingRight = gap + 'px';
    }
    locks++;
    return () => {
      locks--;
      if (locks === 0 && saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [active]);
}
