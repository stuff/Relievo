# AGENTS.md

React design system built on Base UI. See README.md for usage and project structure.

## Commands

- `pnpm typecheck`: type-check `src`, `.storybook` and configs
- `pnpm build`: library build to `dist/` (ESM, types, `styles.css`)
- `pnpm test`: unit tests (Vitest + Testing Library, jsdom); `pnpm test:watch` in watch mode
- `pnpm storybook`: dev Storybook on port 6006

Run `pnpm typecheck`, `pnpm test` and `pnpm build` after every change.

## Tests

- Each component has a `<Name>.test.tsx` next to it. Test behaviour through the DOM the way a user sees it: query by role and accessible name, interact with `userEvent`, avoid asserting on CSS module class names.
- Every styling lock (`className`, `style`) and every accessibility contract (roles, `aria-disabled`, focus) gets a test.
- `src/test/setup.ts` cleans up after each test, including `data-theme` on `<html>`. jsdom has no `matchMedia`: `src/test/matchMedia.ts` mocks it, and `setSystemPrefersDark()` simulates an OS theme change.

## Component rules

- **No styling escape hatches.** Components never accept `className`, `style` or Base UI's `render`. Omit them from the props type, set `className` internally, and pass `style={undefined}` after the props spread so untyped callers are ignored too. Customisation goes through variants, sizes and tokens only.
- **Alternate elements get dedicated props**, not `render`. For example, `Button` takes `href`.
- **Links use the app's router link** from `useLinkComponent()` (configured with `UiKitProvider`), never a hardcoded `<a>`. Exception: a disabled link is a native `<a>` without `href`, with `role="link"` and `aria-disabled`. Do not render links through Base UI Button: it adds `role="button"`.
- **Every stateful component works both controlled and uncontrolled.** For each piece of state, expose a trio named after it, following Base UI: `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, `mode` / `defaultMode` / `onModeChange`. The `on…Change` callback fires in both modes.
  - When Base UI owns the state (Input, and later Select, Dialog, Tabs…), pass its props through: do not wrap them in our own state.
  - When we own the state, use `useControllableState` from `src/utils`. Never a bare `useState` for state a user could want to control.
  - Document both modes: declare the trio in our props interface with our own JSDoc (redeclare it even when Base UI provides it: its descriptions do not explain the two modes), describe both uses in the component's JSDoc, and add `Uncontrolled` and `Controlled` stories.
  - Test both modes: uncontrolled (the default value, then updates on its own) and controlled (renders the prop, only reports changes, follows the parent's update).
  - Dev-only warnings use `process.env.NODE_ENV !== 'production'`, not `import.meta.env.DEV`, which Vite inlines when building the library.
- **Variants and sizes are `data-variant` / `data-size` attributes**, styled in the component's `*.module.scss`. State selectors use Base UI's data attributes (`[data-disabled]`, …).
- **Every public prop has a JSDoc comment** (what it does, when to use which value) and a `@default` tag when it has a default. The Storybook docs API table is generated from these comments with react-docgen-typescript. Do not duplicate them as `argTypes` in stories.
- Inherited props (Base UI, HTML) are hidden from the API table, except those listed in `inheritedPropsToDocument` in `.storybook/main.ts`. Add a prop there when it matters to users of the component.
- Each component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, `<Name>.stories.tsx`, `<Name>.test.tsx` and an `index.ts`, and is re-exported from `src/index.ts`.

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
