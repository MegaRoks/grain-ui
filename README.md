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
| `npm run build` | build the library into `dist/` (ESM + CJS + `.d.ts` + `styles.css` + `fonts.css`) and check the size budget |
| `npm run build-storybook` | static Storybook in `storybook-static/` |
| `npm run new -- Name --group forms` | new component with a story and a test |

## Using in your projects

From GitHub (the build runs automatically via `prepare`):

```bash
npm i github:MegaRoks/grain-ui#v0.1.0 lucide-react
```

```tsx
import 'grain-ui/fonts.css';             // Geist fonts (separate .woff2 files) — skip if you bring your own
import 'grain-ui/styles.css';            // tokens and component styles
import { Button, Dialog, Input, registerIcons } from 'grain-ui';
import { Rocket, Settings } from 'lucide-react';

registerIcons({ Rocket, Settings });     // once at startup: only these icons end up in the bundle
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `lucide-react`.

> `styles.css` includes a base reset for `body`, `a`, `:focus-visible` (see `src/styles/tokens/base.css`). If it gets in the way, remove the `base.css` import from `src/styles/index.css`.

## Components

- **Layout:** Stack, Inline, Grid, GridItem, AppShell
- **Core:** Icon, Button, IconButton, Badge, Tag, Card
- **Forms:** Input, Select, Checkbox, Radio, Switch, ChipGroup, ColorSwatches
- **Navigation:** Tabs + TabPanel, Sidebar + SidebarSection + NavItem, BottomNav
- **Data:** Table, LineChart, BarChart, Sparkline, Heatmap, CalendarHeatmap, Avatar, AvatarGroup
- **Overlays:** Dialog, BottomSheet, Popover, Tooltip
- **Feedback:** Toast, Spinner, Skeleton, LoadingRegion, Progress

A complete example lives in the *Patterns/Dashboard* story.

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
    fonts.css         Geist via @fontsource (shipped as dist/fonts.css)
    index.css         styles entry point
  hooks/  utils/
  docs/               Introduction, Tokens and Dashboard pages in Storybook
  index.ts            public API
scripts/
  new-component.mjs   component generator
  check-size.mjs      bundle size budget (runs after build)
```

## Adding a component

```bash
npm run new -- Accordion --group navigation
```

Creates `src/components/navigation/Accordion/` (tsx, css, stories, test, index) and adds the export to `src/index.ts`.

## Extending

- **Tokens.** Add new variables to `src/styles/tokens/*.css` — the *Foundations/Tokens* page in Storybook picks them up automatically.
- **Themes.** Set `<html data-theme="dark">`. Components use semantic tokens only (`--surface-*`, `--text-*`, `--status-*`, `--chart-*`); `src/styles/styles.test.ts` fails on raw palette steps such as `--gray-50` or `--white`. Missing a token? Add it to `semantic.css` for both themes.
- **Variants.** Add a value to the prop's union type and a `.gr-<name>--<variant>` modifier in CSS.
- **State.** Draw checked/open state from the DOM (`:checked`, `[aria-expanded]`, `[data-state]`), not from classes derived from props — otherwise uncontrolled usage breaks.
- **Overlays.** Dialog, BottomSheet, Popover and Tooltip render into `document.body` via `Portal` and are not clipped by `overflow:hidden`. For custom overlays use `useFloating`, `useFocusTrap`, `useScrollLock`.
- **Icons.** The kit does not pull in the whole Lucide set. Built in: `check`, `x`, `chevron-*`, `chevrons-up-down`, `info`, `circle-check`, `triangle-alert`, `circle-x`, `loader-circle`, `menu`. Everything else: `registerIcons({ Rocket })` then `icon="rocket"`, or pass the component directly: `icon={Rocket}`. An unregistered name logs a hint in dev.
