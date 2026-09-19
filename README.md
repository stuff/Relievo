# Relievo

A React design system built on [Base UI](https://base-ui.com/), written in TypeScript, styled with Sass CSS Modules and CSS custom-property tokens, and documented with Storybook.

## Scripts

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `pnpm storybook`       | Start Storybook at http://localhost:6006      |
| `pnpm build-storybook` | Build a static Storybook to `storybook-static` |
| `pnpm build`           | Build the library to `dist/` (ESM + types + CSS) |
| `pnpm typecheck`       | Type-check the project                        |
| `pnpm test`            | Run the unit tests (Vitest + Testing Library) |
| `pnpm test:watch`      | Run the unit tests in watch mode              |

## Components

| Component | Purpose |
| --- | --- |
| `Box` | Generic container: padding, margin, optional border, element (`as`) |
| `Button` | Actions; `href` renders it as a link; `startIcon` / `endIcon` |
| `ButtonGroup` | Related buttons on a single line, with a fixed gap |
| `Card` | A flat panel grouping related content, with an optional `tone` (and its corner icon) and an `outline` variant: `Card.Header` (`Card.Title`, `Card.Description`), `Card.Body`, `Card.Footer` |
| `Checkbox` | A single yes / no choice, with a mixed state |
| `Input` | Single-line text field with label, helper text, error, icons, prefix / suffix, an end action (`Input.Action`: clear, show password) |
| `Textarea` | Multi-line text field, the same carved field as `Input` |
| `Menu` | A secondary button opening a list of actions: groups, separators, submenus, checkable items |
| `Pagination` | Previous / next and page numbers, as buttons or links |
| `Chip` | Tags and statuses (static), or selectable toggles |
| `Chip.Group` | Filters: several choices among chips |
| `Segmented` | A single choice among a few short options (radio group) |
| `Select` | A single choice among a long list (`Select.Item` children or an `options` array) |
| `ThemeProvider`, `useTheme` | Light / dark / system mode |
| `RelievoProvider` | App-level configuration (router link component) |

## Structure

```
src/
  index.tsx             # package entry: re-exports client.ts, rebuilds compound components
  client.ts             # the kit (built as a 'use client' module)
  components/<Name>/    # component, Sass CSS Module (*.module.scss), stories, tests, index
  theme/                # ThemeProvider and useTheme
  provider/             # RelievoProvider (router link)
  internal/             # shared internals (IconSlot)
  utils/                # useControllableState
  styles/tokens.scss    # design tokens (--rv-*), light/dark palettes, relief tokens
  styles/_*.scss        # shared Sass mixins (control sizes, icons, typography, a11y)
  styles/global.scss    # global element styles (html font size, body colors, scroll behavior)
  overview/             # a story using every component together
  test/                 # test setup and mocks
docs/
  theming.md            # plan for app-chosen colors
  backlog.md            # planned work and open points
```

## Usage

Install the kit with its peer dependencies: `react`, `react-dom` and `@phosphor-icons/react` (the
icon set used by the components and recommended for yours).

```tsx
import { Button } from 'relievo';
import 'relievo/styles.css';

<Button variant="primary" size="md">Save</Button>;
```

## Styling rules

Components do not accept `className`, `style` or Base UI's `render` prop: their look is owned by the design system and changed through variants, sizes and tokens only. Use `href` to render a `Button` as a link.

## Typeface

The kit uses [Geist](https://vercel.com/font) through `@fontsource-variable/geist`, a dependency imported by the package entry. Your bundler emits the font files (about 30 KB for Latin, all weights in one variable file); nothing to configure. Until the font loads, text falls back to the system font.

## Router links

Components that take an `href` render a native `<a>` by default. To use your router's link, pass it once to `RelievoProvider` at the app root. It must forward its props, including `className`, to the rendered `<a>`.

```tsx
// Next.js (App Router): app/providers.tsx
'use client';
import Link from 'next/link';
import { RelievoProvider } from 'relievo';

export function Providers({ children }: { children: React.ReactNode }) {
  return <RelievoProvider linkComponent={Link}>{children}</RelievoProvider>;
}
```

For routers whose link takes another prop than `href` (React Router's `to`), pass a small adapter:

```tsx
const RouterLink = ({ href, ...props }: LinkComponentProps) => <Link to={href} {...props} />;
```

The components are client components, and can be imported from Server Components, dot notation included (`<Card.Body>`).

## Theming (light / dark)

Wrap your app in `ThemeProvider`. `defaultMode` is `"system"` (follow the OS preference, the default), `"light"` or `"dark"`:

```tsx
import { ThemeProvider } from 'relievo';

<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>;
```

To own the mode yourself (to persist it, for example), control it with `mode` and `onModeChange`:

```tsx
const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('theme') as ThemeMode) ?? 'system');

<ThemeProvider
  mode={mode}
  onModeChange={(next) => {
    localStorage.setItem('theme', next);
    setMode(next);
  }}
>
  <App />
</ThemeProvider>;
```

Read or change the mode anywhere inside it with `useTheme()`:

```tsx
const { mode, resolvedMode, setMode } = useTheme();
```

The provider sets `data-theme` on `<html>`, so portalled popups are themed too. In `system` mode it removes the attribute and the CSS follows `prefers-color-scheme`. Render a single provider at the app root. To force a theme for one section, set the attribute directly:

```html
<section data-theme="dark">Always dark here</section>
```

In Storybook, switch modes from the toolbar.
