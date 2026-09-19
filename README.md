# my-ui-kit

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

## Structure

```
src/
  index.ts              # public entry
  styles/tokens.scss    # design tokens (--ui-*), light/dark palettes as Sass maps
  styles/global.scss    # global element styles (html font size, scroll behavior)
  theme/                # ThemeProvider and useTheme
  components/<Name>/    # component, Sass CSS Module (*.module.scss), stories, tests, index
  test/                 # test setup and mocks
```

## Usage

```tsx
import { Button } from 'my-ui-kit';
import 'my-ui-kit/styles.css';

<Button variant="primary" size="md">Save</Button>;
```

## Styling rules

Components do not accept `className`, `style` or Base UI's `render` prop: their look is owned by the design system and changed through variants, sizes and tokens only. Use `href` to render a `Button` as a link.

## Typeface

The kit uses [Geist](https://vercel.com/font) through `@fontsource-variable/geist`, a dependency imported by the package entry. Your bundler emits the font files (about 30 KB for Latin, all weights in one variable file); nothing to configure. Until the font loads, text falls back to the system font.

## Router links

Components that take an `href` render a native `<a>` by default. To use your router's link, pass it once to `UiKitProvider` at the app root. It must forward its props, including `className`, to the rendered `<a>`.

```tsx
// Next.js (App Router): app/providers.tsx
'use client';
import Link from 'next/link';
import { UiKitProvider } from 'my-ui-kit';

export function Providers({ children }: { children: React.ReactNode }) {
  return <UiKitProvider linkComponent={Link}>{children}</UiKitProvider>;
}
```

For routers whose link takes another prop than `href` (React Router's `to`), pass a small adapter:

```tsx
const RouterLink = ({ href, ...props }: LinkComponentProps) => <Link to={href} {...props} />;
```

The bundle is marked `'use client'`, so the components can be imported from Server Components.

## Theming (light / dark)

Wrap your app in `ThemeProvider`. `defaultMode` is `"system"` (follow the OS preference, the default), `"light"` or `"dark"`:

```tsx
import { ThemeProvider } from 'my-ui-kit';

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
