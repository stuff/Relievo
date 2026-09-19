# AGENTS.md

Relievo, a React design system built on Base UI. See README.md for usage, the component list and the project structure, and `docs/backlog.md` for what is planned next.

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
  - **`as`** picks the HTML element among a **closed list** of elements that behave the same and only change the semantics, such as `Card` (`div` / `article` / `section`) or `Card.Title` (`h1`–`h6`). The look never changes with `as`. Anything that changes behaviour (a link, a button) gets its own prop instead.
- **Links use the app's router link** from `useLinkComponent()` (configured with `RelievoProvider`), never a hardcoded `<a>`. Exception: a disabled link is a native `<a>` without `href`, with `role="link"` and `aria-disabled`. Do not render links through Base UI Button: it adds `role="button"`.
- **Every stateful component works both controlled and uncontrolled.** For each piece of state, expose a trio named after it, following Base UI: `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, `mode` / `defaultMode` / `onModeChange`. The `on…Change` callback fires in both modes.
  - When Base UI owns the state (Input, and later Select, Dialog, Tabs…), pass its props through: do not wrap them in our own state.
  - When we own the state, use `useControllableState` from `src/utils`. Never a bare `useState` for state a user could want to control.
  - Document both modes: declare the trio in our props interface with our own JSDoc (redeclare it even when Base UI provides it: its descriptions do not explain the two modes), describe both uses in the component's JSDoc, and add `Uncontrolled` and `Controlled` stories.
  - Test both modes: uncontrolled (the default value, then updates on its own) and controlled (renders the prop, only reports changes, follows the parent's update).
  - Dev-only warnings use `process.env.NODE_ENV !== 'production'`, not `import.meta.env.DEV`, which Vite inlines when building the library.
- **Common props: `tone`, `variant`, `size`.** Every component uses these names, with these meanings:
  - `tone`: the meaning of the component, as a color. Values: `neutral` (default, no meaning), `primary` (brand highlight, no status), `info`, `success`, `warning`, `danger`. A component may support a subset, or none when its states carry no meaning (Segmented: a choice among options has no status, so its selection is always in the brand color). Each tone has two tokens in both palettes: `--rv-color-<tone>-tint`, a vivid color always used transparent for backgrounds (`color-mix(in oklab, var(--rv-color-<tone>-tint), transparent 80%)` for a 20% tint, up to 32%), and `--rv-color-<tone>-text`, the tone as text or border. The text must reach 4.5:1 on the background, the surface, and over the tint up to 32% on either: check it when changing a color or a tint level. Pair a status tone with an icon or text that says the same thing: color alone does not carry meaning.
  - `variant`: how the component is drawn, independently of its tone. The default rendering is `solid`; other values (`outline`, …) are added per component when needed. Button's `primary` / `secondary` / `link` predate this rule.
  - `size`: the scale `xs`, `sm`, `md`, `lg`, default `md`. A component may support a subset (Button and Segmented: `sm`–`lg`), or a single size and no prop (Input). Controls (Button, Input, Segmented) share the heights of `$control-sizes` so they line up; chips are compact and have their own heights.
- **Tone, variant and size are `data-tone` / `data-variant` / `data-size` attributes**, styled in the component's `*.module.scss`. State selectors use Base UI's data attributes (`[data-disabled]`, `[data-pressed]`, …).
- **Choices use the semantics of their kind**:
  - a single choice among a few short options is a `Segmented`: a radio group (`role="radiogroup"`, a `string` value, arrow keys select, `name` for forms), on the control size scale;
  - several choices are a `Chip.Group`: filter chips, toggle buttons, a `string[]` value, wrapping on several lines;
  - a long single-choice list is a `Select`: a carved field (like Input) that opens a floating list of `Select.Item` options. Do not bend Chip.Group or Segmented into it.
- **Compound components** are exposed as properties of the main one (`Chip.Group`), and list the subcomponent in the story's `subcomponents` so its API table shows up. The dot notation must work in Server Components too, where a property attached to a client component is lost: each part is also a named export of `src/client.ts` (`export const ChipGroup = Chip.Group`), and `src/index.tsx` rebuilds the compound from those exports (see Build). A new compound component, or a new part, goes in both files; `src/index.test.tsx` checks it. Do not export the parts from the component files: Storybook names a component after its export in the code snippets, which would show `<ChipGroup>` instead of `<Chip.Group>`.
- **Stories that open a popup by default** (`defaultOpen`: a select's list, later menus and dialogs) take the focus, which scrolls the Docs page to them: tag them `tags: ['!autodocs']` so they stay in the sidebar but not on the Docs page.
- **Every public prop has a JSDoc comment** (what it does, when to use which value) and a `@default` tag when it has a default. The Storybook docs API table is generated from these comments with react-docgen-typescript. Do not duplicate them as `argTypes` in stories.
- Inherited props (Base UI, HTML) are hidden from the API table, except those listed in `inheritedPropsToDocument` in `.storybook/main.ts`. Add a prop there when it matters to users of the component.
- **Icons**: the kit uses Phosphor (`@phosphor-icons/react`) in the `bold` weight. It is a peerDependency, external to the bundle. Render icons through `IconSlot` (`src/internal`), which provides Phosphor's `IconContext` with the bold weight: do not pass `weight` in stories or components. Phosphor's `/ssr` icons (Server Components) ignore the context: document `weight="bold"` for them. Components take icons as elements (`startIcon={<PlusIcon />}`), never as component references, because a Server Component cannot pass a function to a Client Component. Icons are wrapped in a slot using the `icon-slot` mixin (`src/styles/_icons.scss`), which forces their size and color from CSS, and marked `aria-hidden`: they are decorative. Anything clickable next to a value (clear, show password) is a separate, interactive prop, not an icon prop.
- Each component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, `<Name>.stories.tsx`, `<Name>.test.tsx` and an `index.ts`, and is re-exported from `src/client.ts`, then from `src/index.tsx`.
- **Every component appears in the Overview story** (`src/overview/Overview.stories.tsx`, "All components"), used where it would be on a real screen: add it there when you create one.

## Typography

- The kit's typeface is Geist (`@fontsource-variable/geist`, OFL, variable: one file for every weight). `src/client.ts` imports it and it stays external to the bundle, so the app's bundler serves the font files. Storybook imports it in `.storybook/preview.tsx`.
- Every metric-sensitive choice (heights, `text-box` trimming, optical offsets) is measured with Geist. Do not tune centering for system fonts: they only show while Geist loads.
- Labels in pills (Button, Chip, Segmented items) are trimmed to their capitals with the `trim-text` mixin (`src/styles/_typography.scss`), on a wrapper element: `text-box` does not reach text placed directly in a flex container. An `<input>` value cannot be trimmed: the Input pill offsets its content by whole pixels instead (half pixels move the affixes but not the value).

## Relief

Relief tells what can be pressed. Use the relief tokens (defined per theme in the `palette` mixin of `src/styles/tokens.scss`), never ad hoc shadows:

- **Raised: it can be pressed.** Buttons (`--rv-shadow-raised`, with the primary / sheen gradients) selectable chips (`--rv-shadow-raised-sm`) and the Checkbox cube.
- **Pressed: pushed or selected.** A button while active (`--rv-shadow-pressed`), a selected chip (`--rv-shadow-pressed-sm`).
- **Carved: a value goes here.** Text fields: `--rv-color-field` background (near white in light, the page background in dark), `--rv-shadow-inset`, and `--rv-field-depth` (a dark gradient at the bottom) while not focused.
- **Floating: a layer above the page.** A select's list, a menu (`--rv-shadow-floating`, surface background, border; the `floating` mixins in `src/styles/_floating.scss`). Its content is flat: the options are rows, not buttons.
- **Flat: everything else**, including static chips, which are information. Disabled controls lose their relief.
- **Exception, `Segmented`**: the track is carved (it holds one value), unselected items are flat inside it, and the chosen item comes out raised, like a thumb on a rail. Its highlight is a pseudo-element of the track anchored to the chosen item (CSS anchor positioning, `anchor-scope` per control), so it slides between items without JavaScript; browsers without anchor positioning get a static highlight. Everywhere else, a selected control is pressed in.
- **Exception, `Checkbox`**: the box is a raised cube in the secondary button colors; ticked, it turns primary and **stays raised**, and the check mark carries the selection. Pressed, it goes down physically (`--rv-press-offset`, `--rv-shadow-contact`) instead of taking an inset shadow, which would eat most of so small a box and push the check off-center.
- **Selection never relies on color alone** (WCAG 1.4.1): a selected chip also gets a full-strength ring. Check new selectable components in grayscale.

In dark theme, black shadows vanish on the dark background: the relief comes from a stronger highlight and a thin lit top edge instead. Check both themes when changing a relief value.

## Motion

Micro animations make state changes readable; the plan is to add them across the kit over time (see `docs/backlog.md`).

- Use the motion tokens of `tokens.scss`: `--rv-duration-press` (pressing), `--rv-duration-state` (a state change), `--rv-easing-pop` (an element popping in).
- Turn transitions off under `@media (prefers-reduced-motion: reduce)`.
- Gradients cannot be transitioned: put the new gradient on a layer (a pseudo-element) and transition its opacity (Checkbox's primary fill).
- Elements Base UI mounts and unmounts (indicators, popups) animate with `[data-starting-style]` / `[data-ending-style]`: Base UI waits for the transition before removing them.

## Colors

Apps will be able to choose some colors (the primary, the background): see `docs/theming.md`. Until then, every new color must fit one of these categories, never be a one-off literal:

- **Seed**: primary or background, chosen by the app (today still hardcoded per theme in `tokens.scss`).
- **Derived**: computed from a seed (`color-mix()`, or OKLCH relative colors where contrast matters: the kit fixes the lightness, the seed gives the hue).
- **Status tone**: `info`, `success`, `warning`, `danger`, fixed by the kit.
- **Neutral constant**: black or white, usually with alpha, valid on any background of its theme.

Components never contain a color literal: only `--rv-*` tokens. Adding a hardcoded color to `tokens.scss` means adding a line to the inventory in `docs/theming.md`.

## Tokens and theming

- Tokens are CSS custom properties prefixed `--rv-`, defined in `src/styles/tokens.scss`.
- Floating layers (Select, Menu, later dialogs) take their `z-index` from a layer token (`--rv-z-floating`), never a literal: they are portalled to the end of the page and must cover the app's raised elements (sticky bars…).
- Colors live in the `$light-palette` / `$dark-palette` Sass maps, which must have the same keys (a Sass `@error` enforces it).
- Tokens derived with `var()` (for example `color-mix(..., var(--rv-color-primary), ...)`) must be redeclared in every theme block, through the `palette` mixin. If they are declared only on `:root`, `data-theme` subtrees would not pick them up.
- Do not use `light-dark()`: CSS minifiers downlevel it in a way that breaks subtree theme overrides.
- `ThemeProvider` sets `data-theme` on `<html>`. Only one should be rendered per page.

## Build

- `react`, `react-dom`, `@base-ui/react`, `@phosphor-icons/react` and `@fontsource-variable/geist` are external to the bundle (`vite.config.ts`). React and Phosphor are peerDependencies; Base UI and Geist are dependencies.
- Two entries. `src/client.ts` is the kit; `src/index.tsx` is the package entry, which re-exports it and rebuilds compound components (`Card.Body`…) as thin wrappers whose parts are client references, so the dot notation works in Server Components. `index.tsx` runs on the server: no hooks, state or context in it.
- Every built file but `index.js` starts with `'use client'` (a Rolldown banner in `vite.config.ts`): Rolldown moves the shared code into a hashed chunk that `index.js` imports directly, so the directive cannot be limited to `client.js`. Do not add the directive to source files.

## Naming and repository

- The kit is **Relievo**: package `relievo`, provider `RelievoProvider`, token prefix `--rv-`. Use these names in code, docs and stories.
- Repository: `git@github.com:stuff/Relievo.git` (remote `origin`, branch `main`). Private for now, to be open-sourced later; the history may be rewritten before going public (undecided). Before any public release, remind the maintainer that commits carry their email and `Co-Authored-By` lines.

## Working with the maintainer

- The maintainer talks in French; code, comments, docs and commit messages are in English. Answer in French and use *tu* with the maintainer, not *vous*.
- Propose before building when a choice is a design decision: give options with a recommendation, then wait. The maintainer makes the visual calls.
- Try visual changes as a **mockup in a story first** (story-local CSS overriding tokens, components untouched), iterate on it, integrate into the components once approved, then delete the mockup. **Animations** are validated by the maintainer in a temporary story in Storybook: no need to capture them (frames, GIF).
- **Show visual changes with captures in both themes**, and measure when it matters (contrast ratios, pixel centering) instead of eyeballing. Recipe: `pnpm build-storybook -o <dir>`, serve it (`python3 -m http.server 6199 -d <dir>`), then `google-chrome --headless=new --no-sandbox --hide-scrollbars --force-device-scale-factor=2 --window-size=W,H --virtual-time-budget=10000 --screenshot=out.png "http://localhost:6199/iframe.html?id=<story-id>&viewMode=story&globals=theme:light"` (`theme:dark` for dark; use a window of at least 300px high or the capture is cut). Check selection states in grayscale too. Save the captures you send in `storybook-static/captures/` (gitignored): the desktop app does not display images from `/tmp`. Combining the light and dark captures into one image (ImageMagick `convert`, `+append` / `-append`) makes them easier to compare.
- **Commit only when asked**, one commit per topic (split mixed files by staging intermediate versions), then push to `origin` when asked. Run typecheck, tests and build before committing.
