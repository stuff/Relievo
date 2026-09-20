# Backlog

Ideas and open points gathered while building the kit, roughly by priority within each section.
Nothing here is decided unless stated: check with the maintainer before starting an item.

## Next steps

- **App-chosen colors**: primary and background as seeds, everything else derived with a fixed
  lightness per role. Full plan and inventory in `docs/theming.md`.

## Asked for by the cv app

The `cv` app is migrating to Relievo (its `packages/web/AGENTS.md` holds the inventory) and is
short of these, in the order it needs them. Each one is a design decision: propose options and a
mockup before building.

- **Inline message**: one line of text with a tone (`info`, `neutral`, `warning`, `danger`), an
  icon and rich content (a link, a button, a checkbox). `Card tone` exists but is too heavy.
- **Navigation tabs**: links with an icon, a count and a current tab (`aria-current`). Neither
  `Segmented` (a radio group) nor `Chip.Group` (toggles) is navigation.
- **Text link**: a link inside running text or a title. `Button variant="link"` has a control's
  height and padding, so it cannot sit in a sentence.
- **Text highlight**: a token for `mark` (search results). `--rv-color-highlight` is the relief's
  light, not that.
- **Dimmed card**: a card that stays readable but steps back (a dismissed item).
- **Key figure**: a number with its label. A compact `Card` variant may be enough.
- **Loading indicator**: the app lost its spinner when its search field became an `Input`.

## Components

- **Micro animations everywhere**: state changes (hover, press, selection, focus, error) animated
  with the motion tokens, as in Checkbox. Existing components still use literal durations
  (150ms, 250ms): move them to the tokens.
- **Icon-only Button**: square, with a required `aria-label`.
- **Removable chip**: an `onRemove` prop rendering an accessible remove button inside the chip.
- **Button `tone`**: Button's `variant="primary"` predates the common `tone` prop; aligning it
  (`<Button tone="primary">`, `tone="danger"` for destructive actions) would make every component
  follow the same rule.

## Design consistency (from the Overview story review)

- **Secondary button in dark theme** barely stands out from a card: dark gray on dark gray, only
  the relief separates them.
- **One type scale, applied on purpose**: sizes were picked per component and they collide when
  components are nested. In one `Alert` (body text `sm`) holding a `Checkbox` (label `md`) and a
  `Button` (`sm`, its own control scale), the controls read larger than the message they belong to,
  which is backwards. Card is `md`, Card.Description and field labels `sm`, and Chip has four
  literal sizes of its own (0.6875–0.875rem). Decide what each role is worth (body, secondary text,
  control label, title), write it down, then apply it across the kit.
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
  library. Consider a separate export (`relievo/global.css`).
- **`license`** is missing from `package.json` (to set before open-sourcing).
- **No linter or formatter** yet (ESLint, Prettier or Biome).
