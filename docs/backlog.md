# Backlog

Ideas and open points gathered while building the kit, roughly by priority within each section.
Nothing here is decided unless stated: check with the maintainer before starting an item.

## Next steps

- **Rename to Relievo** (name chosen, not done): package name, `UiKitProvider`, README, AGENTS.md,
  maybe the `--ui-` token prefix. Only when the maintainer asks.
- **App-chosen colors**: primary and background as seeds, everything else derived with a fixed
  lightness per role. Full plan and inventory in `docs/theming.md`.

## Components

- **Micro animations everywhere**: state changes (hover, press, selection, focus, error) animated
  with the motion tokens, as in Checkbox. Existing components still use literal durations
  (150ms, 250ms): move them to the tokens.
- **Icon-only Button**: square, with a required `aria-label`.
- **Input end action**: a clickable element at the end of the field (clear, show password), as a
  separate interactive prop (`endAction`?), not an icon prop.
- **Removable chip**: an `onRemove` prop rendering an accessible remove button inside the chip.
- **Button `tone`**: Button's `variant="primary"` predates the common `tone` prop; aligning it
  (`<Button tone="primary">`, `tone="danger"` for destructive actions) would make every component
  follow the same rule.

## Design consistency (from the Overview story review)

- **Secondary button in dark theme** barely stands out from a card: dark gray on dark gray, only
  the relief separates them.
- **Label alignment**: Input labels are indented to line up with the text inside the pill, while
  card titles and other labels start at the edge. Decide on one rule.
- **Placeholder contrast**: on the near-white field, the placeholder is probably under the
  recommended contrast. Measure it and darken if needed.
- **Button `lg` label** sits half a pixel high with Geist (rounds to 1px): adjusting its font size
  could make the math land on whole pixels.
- **`primary` and `success`** are both green; shifting success toward teal would separate them.

## Typography and loading

- **Font swap (FOUT)**: Geist loads with `font-display: swap`, so text first renders in the system
  font. Options: document preloading the Latin file (`<link rel="preload" as="font">`) in the
  README, and/or declare a fallback font with Geist's metrics (`size-adjust`, `ascent-override`…)
  so the swap barely moves the text.

## Package and tooling

- **Global styles in `styles.css`**: `global.scss` (box-sizing reset, `html` font size, `body`
  background and color, smooth scrolling) ships in the main stylesheet, which is intrusive for a
  library. Consider a separate export (`my-ui-kit/global.css`).
- **`license`** is missing from `package.json` (to set before open-sourcing).
- **No linter or formatter** yet (ESLint, Prettier or Biome).
