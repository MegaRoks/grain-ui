// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const RAW_PALETTE = /var\(--(gray|accent|green|amber|red)-\d+\)|var\(--white\)|var\(--light-a\d+\)/;

describe('правила стилей', () => {
  const files = [
    ...walk(join(root, 'styles/components')),
    ...walk(join(root, 'components')).filter((f) => /\.(css|tsx)$/.test(f) && !/\.(stories|test)\.tsx$/.test(f)),
  ];

  it('компоненты используют только семантические токены, без сырой палитры', () => {
    const offenders = files.flatMap((f) =>
      readFileSync(f, 'utf8').split('\n').map((line, i) => [f.replace(root, 'src'), i + 1, line] as const).filter(([, , l]) => RAW_PALETTE.test(l)),
    );
    expect(offenders.map(([f, n, l]) => `${f}:${n}  ${l.trim().slice(0, 90)}`)).toEqual([]);
  });

  it('состояние отметки чекбокса/радио/свитча рисуется от :checked, а не от класса', () => {
    const css = readFileSync(join(root, 'styles/components/forms.css'), 'utf8');
    expect(css).not.toMatch(/gr-check--checked|gr-switch--on/);
    expect(css).toMatch(/input:checked\+\.gr-check__box/);
    expect(css).toMatch(/input:checked\+\.gr-switch__track/);
  });

  it('закрытые оверлеи получают visibility:hidden', () => {
    const css = readFileSync(join(root, 'styles/components/overlays.css'), 'utf8');
    expect(css).toMatch(/\.gr-popover\[data-state="closed"\]\{[^}]*visibility:hidden/);
    expect(css).toMatch(/\.gr-tooltip\[data-state="closed"\]\{[^}]*visibility:hidden/);
  });

  it('styles/index.css не тянет шрифты (они в fonts.css)', () => {
    expect(readFileSync(join(root, 'styles/index.css'), 'utf8')).not.toMatch(/fontsource/);
  });
});
