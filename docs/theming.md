# Theming: user-chosen colors (plan)

Goal: let an app choose a few colors (the primary, the background) so apps built with the kit do
not all look alike, while the kit keeps its guarantees: 4.5:1 text contrast, relief that reads in
both themes, status colors that keep their meaning.

Not built yet. This document is the inventory and the plan; the rule that applies now is in
AGENTS.md ("Colors").

## Principle: the user picks the hue, the kit keeps the lightness

The user gives **seed colors**. The kit keeps each seed's hue and chroma and sets the lightness per
role and per theme, with CSS relative color syntax in OKLCH:

```css
--ui-color-primary-text: oklch(from var(--ui-seed-primary) 0.42 c h); /* light theme */
--ui-color-primary-text: oklch(from var(--ui-seed-primary) 0.82 c h); /* dark theme */
```

Contrast then depends on lightness only, which the kit controls, so it holds for any seed hue.
Very saturated seeds may need their chroma clamped at the extreme lightnesses (out of gamut).

Planned API: `RelievoProvider` gets `theme={{ primary, background }}`, which sets `--ui-seed-*`
custom properties; CSS users can set those properties directly.

## Color categories

Every color in the kit falls in one of these categories:

| Category | Rule | Examples |
|---|---|---|
| **Seed** | Chosen by the app, with a kit default | primary, background |
| **Derived** | Computed from a seed; the kit fixes lightness where contrast matters | primary-text, surface, field, shadow, gradients |
| **Status tone** | Fixed by the kit, not customizable: danger must stay red from one app to another | info, success, warning, danger |
| **Neutral constant** | Black or white, often with alpha, valid on any background of the theme | text, surface-hover, dark border, lit edge |

## Inventory (tokens.scss, as of the Segmented component)

Components contain no color literal: they only use `--ui-*` tokens. Everything below is in
`src/styles/tokens.scss`.

### Seeds, today hardcoded per theme

| Token | Light | Dark | Plan |
|---|---|---|---|
| `primary` | `#45824d` | `#305836` | One seed; the dark value derived from it (lower lightness) |
| `background` | `#dad6c3` | `rgb(23, 19, 19)` | One seed; dark derived from its hue. Lightness clamped per theme so the relief works (light: bright background, dark: very dark) |

### Hardcoded, to derive

| Token | Theme | Today | Why it breaks with a custom seed | Plan |
|---|---|---|---|---|
| `primary-text` | dark | `#9ccfa3` | Stays green for any primary | `oklch(from primary 0.82 c h)` |
| `primary-tint` | dark | `#5fae6a` | Stays green | `oklch(from primary ~0.68 c h)` |
| `surface` | light | `#f3f0e4` | Stays beige on another background | From background, higher lightness |
| `surface` | dark | `rgb(35, 28, 28)` | Same | From background, slightly higher lightness |
| `neutral-tint`, `neutral-text` | both | warm grays (`#8a8272`, `#423e35`, …) | Tuned to the beige background | Background hue, low chroma, fixed lightness |

### Derived, but not contrast-safe for any seed

| Token | Today | Risk | Plan |
|---|---|---|---|
| `primary-text` (light) | `color-mix(primary, black 35%)` | A light primary (yellow) stays too light | Fixed lightness in OKLCH |
| `on-primary` | white with alpha | Unreadable on a light primary | Fix the button fill lightness so white always passes, or pick white/near-black from the fill lightness |
| `focus-ring` | primary (light), primary + white (dark) | Needs 3:1 against the surface | Fixed lightness |
| `primary-top` / `primary-bottom` | primary ± white/black | Fine as long as the fill lightness is controlled | Derive from the fixed-lightness fill |

### Already fine

- Derived from seeds: `border` (light), `shadow` (light), `highlight` (dark), `field`, `sheen-*`,
  the relief shadows, `field-depth`.
- Neutral constants: `text`, `text-muted` (`text`, 15% more transparent), `surface-hover`,
  `border` (dark), `highlight` (light, white), `shadow` (dark, black), the lit edge.
- Status tones: `info`, `success`, `warning`, `danger` (`-tint` and `-text`, plus
  `danger-text-muted`, 20% more transparent, for error messages). Their contrast was
  checked against our backgrounds: re-check against the clamped background lightness range.

## Tests to add with the feature

A contrast test over a grid of seeds (every 30° of hue, low / medium / high chroma, both themes):
every text / background pair of the kit must reach 4.5:1, focus rings and selection rings 3:1.
It replaces the manual checks done so far.
