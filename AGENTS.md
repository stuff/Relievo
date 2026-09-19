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
- **Common props: `tone`, `variant`, `size`.** Every component uses these names, with these meanings:
  - `tone`: the meaning of the component, as a color. Values: `neutral` (default, no meaning), `primary` (brand highlight, no status), `info`, `success`, `warning`, `danger`. A component may support a subset. Each tone has two tokens in both palettes: `--ui-color-<tone>-tint`, a vivid color always used transparent for backgrounds (`color-mix(in oklab, var(--ui-color-<tone>-tint), transparent 80%)` for a 20% tint, up to 32%), and `--ui-color-<tone>-text`, the tone as text or border. The text must reach 4.5:1 on the background, the surface, and over the tint up to 32% on either: check it when changing a color or a tint level. Pair a status tone with an icon or text that says the same thing: color alone does not carry meaning.
  - `variant`: how the component is drawn, independently of its tone. The default rendering is `solid`; other values (`outline`, …) are added per component when needed. Button's `primary` / `secondary` / `link` predate this rule.
  - `size`: the scale `xs`, `sm`, `md`, `lg`, default `md`. A component may support a subset (Button: `sm`–`lg`), or a single size and no prop (Input).
- **Tone, variant and size are `data-tone` / `data-variant` / `data-size` attributes**, styled in the component's `*.module.scss`. State selectors use Base UI's data attributes (`[data-disabled]`, `[data-pressed]`, …).
- **Compound components** are exposed as properties of the main one (`Chip.Group`), and list the subcomponent in the story's `subcomponents` so its API table shows up.
- **Every public prop has a JSDoc comment** (what it does, when to use which value) and a `@default` tag when it has a default. The Storybook docs API table is generated from these comments with react-docgen-typescript. Do not duplicate them as `argTypes` in stories.
- Inherited props (Base UI, HTML) are hidden from the API table, except those listed in `inheritedPropsToDocument` in `.storybook/main.ts`. Add a prop there when it matters to users of the component.
- **Icons**: the kit uses Phosphor (`@phosphor-icons/react`) in the `bold` weight. It is a peerDependency, external to the bundle. Render icons through `IconSlot` (`src/internal`), which provides Phosphor's `IconContext` with the bold weight: do not pass `weight` in stories or components. Phosphor's `/ssr` icons (Server Components) ignore the context: document `weight="bold"` for them. Components take icons as elements (`startIcon={<PlusIcon />}`), never as component references, because a Server Component cannot pass a function to a Client Component. Icons are wrapped in a slot using the `icon-slot` mixin (`src/styles/_icons.scss`), which forces their size and color from CSS, and marked `aria-hidden`: they are decorative. Anything clickable next to a value (clear, show password) is a separate, interactive prop, not an icon prop.
- Each component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, `<Name>.stories.tsx`, `<Name>.test.tsx` and an `index.ts`, and is re-exported from `src/index.ts`.

## Typography

- The kit's typeface is Geist (`@fontsource-variable/geist`, OFL, variable: one file for every weight). `src/index.ts` imports it and it stays external to the bundle, so the app's bundler serves the font files. Storybook imports it in `.storybook/preview.tsx`.
- Every metric-sensitive choice (heights, `text-box` trimming, optical offsets) is measured with Geist. Do not tune centering for system fonts: they only show while Geist loads.
- Labels in pills (Button, Chip) are trimmed to their capitals with the `trim-text` mixin (`src/styles/_typography.scss`), on a wrapper element: `text-box` does not reach text placed directly in a flex container. An `<input>` value cannot be trimmed: the Input pill offsets its content by whole pixels instead (half pixels move the affixes but not the value).

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
