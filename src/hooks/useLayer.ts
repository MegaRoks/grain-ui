import * as React from 'react';

/** Стек открытых слоёв (диалоги, меню): Escape и Tab обрабатывает только верхний. */
const stack: number[] = [];
let seq = 0;

export function isTopLayer(id: number) {
  return stack[stack.length - 1] === id;
}

export function useLayer(active: boolean): number {
  const id = React.useMemo(() => ++seq, []);
  React.useEffect(() => {
    if (!active) return;
    stack.push(id);
    return () => {
      const i = stack.lastIndexOf(id);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [active, id]);
  return id;
}
