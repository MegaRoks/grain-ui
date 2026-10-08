#!/usr/bin/env node
// Генератор компонента: npm run new -- <Name> [--group core|forms|navigation|overlays|feedback|<любая>]
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const gi = args.indexOf('--group');
const group = gi >= 0 ? args[gi + 1] : 'core';

if (!name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
  console.error('Использование: npm run new -- MyComponent --group forms   (имя в PascalCase)');
  process.exit(1);
}
if (!/^[a-z][a-z0-9-]*$/.test(group)) {
  console.error('Группа — латиница в нижнем регистре, напр. forms');
  process.exit(1);
}

const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cls = 'gr-' + kebab;
const title = group.charAt(0).toUpperCase() + group.slice(1);
const dir = join(root, 'src/components', group, name);
if (existsSync(dir)) {
  console.error('Уже существует: ' + dir);
  process.exit(1);
}

const files = {
  [`${name}.tsx`]: `import * as React from 'react';
import { cx } from '../../../utils/cx';
import './${name}.css';

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Пример варианта — замените или удалите. */
  variant?: 'default' | 'subtle';
}

/** TODO: одно предложение — что это и когда использовать. */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(function ${name}(
  { variant = 'default', className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('${cls}', variant !== 'default' && '${cls}--' + variant, className)} {...rest} />;
});
`,
  [`${name}.css`]: `/* ${name}. Используйте только токены: var(--space-*), var(--radius-*), var(--ease-*), var(--duration-*). */
.${cls}{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);
  border-radius:var(--radius-control);color:var(--text-body)}
.${cls}--subtle{color:var(--text-muted)}
`,
  [`${name}.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta = {
  title: '${title}/${name}',
  component: ${name},
  tags: ['autodocs'],
  args: { children: '${name}' },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'subtle'] } },
} satisfies Meta<typeof ${name}>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Subtle: Story = { args: { variant: 'subtle' } };
`,
  [`${name}.test.tsx`]: `import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('рендерит детей', () => {
    render(<${name}>Привет</${name}>);
    expect(screen.getByText('Привет')).toHaveClass('${cls}');
  });
  it('применяет вариант и className', () => {
    render(<${name} variant="subtle" className="x">A</${name}>);
    expect(screen.getByText('A')).toHaveClass('${cls}--subtle', 'x');
  });
  it('пробрасывает ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<${name} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
`,
  'index.ts': `export * from './${name}';\n`,
};

mkdirSync(dir, { recursive: true });
for (const [f, c] of Object.entries(files)) writeFileSync(join(dir, f), c);

const indexPath = join(root, 'src/index.ts');
const marker = '// @new-component-exports';
const line = `export * from './components/${group}/${name}';\n`;
const index = readFileSync(indexPath, 'utf8');
writeFileSync(indexPath, index.includes(marker) ? index.replace(marker, line + marker) : index + line);

console.log(`✔ src/components/${group}/${name}/ создан и экспортирован из src/index.ts`);
console.log('  Дальше: npm run dev  →  Storybook, npm run test:watch  →  тесты');
