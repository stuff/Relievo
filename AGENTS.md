# AGENTS.md

React design system built on Base UI. See README.md for usage and project structure.

## Commands

- `pnpm typecheck`: type-check `src`, `.storybook` and configs
- `pnpm build`: library build to `dist/` (ESM, types, `styles.css`)
- `pnpm storybook`: dev Storybook on port 6006

Run `pnpm typecheck` and `pnpm build` after every change. There are no tests yet.

## Component rules

- **No styling escape hatches.** Components never accept `className`, `style` or Base UI's `render`. Omit them from the props type, set `className` internally, and pass `style={undefined}` after the props spread so untyped callers are ignored too. Customisation goes through variants, sizes and tokens only.
- **Alternate elements get dedicated props**, not `render`. For example, `Button` takes `href`.
- **Links use the app's router link** from `useLinkComponent()` (configured with `UiKitProvider`), never a hardcoded `<a>`. Exception: a disabled link is a native `<a>` without `href`, with `role="link"` and `aria-disabled`. Do not render links through Base UI Button: it adds `role="button"`.
- **Variants and sizes are `data-variant` / `data-size` attributes**, styled in the component's `*.module.scss`. State selectors use Base UI's data attributes (`[data-disabled]`, …).
- Each component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, `<Name>.stories.tsx` and an `index.ts`, and is re-exported from `src/index.ts`.

## Tokens and theming

- Tokens are CSS custom properties prefixed `--ui-`, defined in `src/styles/tokens.scss`.
- Colors live in the `$light-palette` / `$dark-palette` Sass maps, which must have the same keys (a Sass `@error` enforces it).
- Tokens derived with `var()` (for example `color-mix(..., var(--ui-color-primary), ...)`) must be redeclared in every theme block, through the `palette` mixin. If they are declared only on `:root`, `data-theme` subtrees would not pick them up.
- Do not use `light-dark()`: CSS minifiers downlevel it in a way that breaks subtree theme overrides.
- `ThemeProvider` sets `data-theme` on `<html>`. Only one should be rendered per page.

## Build

- `react`, `react-dom` and `@base-ui/react` are external to the bundle.
- The bundle starts with `'use client'` (a Rolldown banner in `vite.config.ts`). Do not add the directive to source files.

## Naming

"UiKit" / `my-ui-kit` is a placeholder name. Keep using it until the user picks a real name.
