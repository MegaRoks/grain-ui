# Grain UI

Motion-first React UI kit: TypeScript, Storybook, Vitest + Testing Library, design tokens as CSS custom properties.

## Quick start

```bash
npm install
npm run dev          # Storybook at http://localhost:6006
npm run test:watch   # tests in watch mode
```

| Script | What it does |
|---|---|
| `npm run dev` | Storybook |
| `npm test` | run all tests once |
| `npm run coverage` | coverage report |
| `npm run typecheck` | type checking |
| `npm run build` | build the library into `dist/` (ESM + CJS + `.d.ts` + `styles.css`) |
| `npm run build-storybook` | static Storybook in `storybook-static/` |
| `npm run new -- Name --group forms` | new component with a story and a test |

## Using in your projects

From GitHub (the build runs automatically via `prepare`):

```bash
npm i github:MegaRoks/grain-ui#v0.1.0 lucide-react
```

```tsx
import 'grain-ui/styles.css';            // tokens, Geist fonts, component styles
import { Button, Dialog, Input } from 'grain-ui';
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `lucide-react`.

> `styles.css` includes a base reset for `body`, `a`, `:focus-visible` (see `src/styles/tokens/base.css`). If it gets in the way, remove the `base.css` import from `src/styles/index.css`.

## Structure

```
src/
  components/<group>/<Name>/
    Name.tsx          component + prop types (JSDoc → Storybook docs)
    Name.stories.tsx  stories
    Name.test.tsx     tests
    Name.css          styles (for new components; imported from Name.tsx)
    index.ts
  styles/
    tokens/*.css      tokens: color, typography, spacing, radius, shadows, motion
    components/*.css  styles of the original components, by group
    index.css         styles entry point
  hooks/  utils/
  docs/               Introduction and Tokens pages in Storybook
  index.ts            public API
scripts/new-component.mjs
```

## Adding a component

```bash
npm run new -- Accordion --group navigation
```

Creates `src/components/navigation/Accordion/` (tsx, css, stories, test, index) and adds the export to `src/index.ts`.

## Extending

- **Tokens.** Add new variables to `src/styles/tokens/*.css` — the *Foundations/Tokens* page in Storybook picks them up automatically.
- **Themes.** Override the semantic tokens (`--bg-*`, `--text-*`, `--accent-*`) under a selector, e.g. `[data-theme="dark"] { … }`, in `semantic.css`.
- **Variants.** Add a value to the prop's union type and a `.gr-<name>--<variant>` modifier in CSS.
- **Icons.** `Icon` accepts any [lucide.dev](https://lucide.dev/icons) icon name in kebab-case.
