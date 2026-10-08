import * as React from 'react';

export type PresenceState = 'open' | 'closed';

/** Держит узел смонтированным на время exit-перехода. */
export function usePresence(open: boolean, exitMs = 200): [boolean, PresenceState] {
  const [present, setPresent] = React.useState(open);
  const [state, setState] = React.useState<PresenceState>(open ? 'open' : 'closed');
  React.useEffect(() => {
    if (open) {
      setPresent(true);
      const r = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(r);
    }
    setState('closed');
    const t = setTimeout(() => setPresent(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  return [present, state];
}
