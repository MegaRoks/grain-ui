import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

/** Собирает все custom properties из :root во всех подключённых стилях. */
function readTokens(): string[] {
  const names = new Set<string>();
  const walk = (rules: CSSRuleList) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSImportRule && r.styleSheet) walk(r.styleSheet.cssRules);
      else if (r instanceof CSSStyleRule && r.selectorText === ':root') {
        for (const p of Array.from(r.style)) if (p.startsWith('--')) names.add(p);
      } else if ('cssRules' in r) walk((r as CSSGroupingRule).cssRules);
    }
  };
  for (const s of Array.from(document.styleSheets)) {
    try { walk(s.cssRules); } catch { /* cross-origin */ }
  }
  return [...names];
}

function useTokens(test: (name: string, value: string) => boolean) {
  const [list, setList] = useState<Array<[string, string]>>([]);
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setList(readTokens().map((n) => [n, cs.getPropertyValue(n).trim()] as [string, string]).filter(([n, v]) => test(n, v)));
  }, []);
  return list;
}

const isColor = (v: string) => /^(#|rgb|hsl|oklch|oklab|color\()/.test(v);
const label: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, width: 'min(100%, 960px)' };

function Colors() {
  const list = useTokens((_, v) => isColor(v));
  return (
    <div style={grid}>
      {list.map(([n, v]) => (
        <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 48, borderRadius: 'var(--radius-control)', background: 'var(' + n + ')', boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .08)' }} />
          <span style={{ fontSize: 13 }}>{n}</span>
          <span style={label}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function Scale({ prefix, render }: { prefix: string; render: (n: string) => React.ReactNode }) {
  const list = useTokens((n) => n.startsWith(prefix));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.map(([n, v]) => (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: '200px 160px 1fr', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13 }}>{n}</span>
          <span style={label}>{v}</span>
          {render(n)}
        </div>
      ))}
    </div>
  );
}

const meta = { title: 'Foundations/Tokens', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Color: Story = { render: () => <Colors /> };
export const Spacing: Story = {
  render: () => <Scale prefix="--space-" render={(n) => <div style={{ height: 12, width: 'var(' + n + ')', background: 'var(--accent-500, #3b82f6)', borderRadius: 2 }} />} />,
};
export const Radius: Story = {
  render: () => <Scale prefix="--radius-" render={(n) => <div style={{ height: 40, width: 64, borderRadius: 'var(' + n + ')', boxShadow: 'inset 0 0 0 1px var(--text-subtle)' }} />} />,
};
export const Shadow: Story = {
  render: () => <Scale prefix="--shadow-" render={(n) => <div style={{ height: 40, width: 96, borderRadius: 8, background: '#fff', boxShadow: 'var(' + n + ')' }} />} />,
};
export const Motion: Story = {
  render: () => <Scale prefix="--ease-" render={() => null} />,
};
export const Duration: Story = {
  render: () => <Scale prefix="--duration-" render={() => null} />,
};
