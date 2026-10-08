# Changelog

All notable changes to Relievo are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/) as described in [`docs/releasing.md`](docs/releasing.md).

## [Unreleased]

The first release will be 0.1.0. What it contains:

### Added

- Layout: `Box`, `Stack`, `Card` (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Body`, `Card.Footer`, tones, `outline` variant, `padding`).
- Actions and navigation: `Button` (`solid` and `link` variants, `neutral`, `accent` and status tones, as a link with `href`, icons), `ButtonGroup`, `Link`, `Menu` (groups, separators, submenus, checkable items), `Pagination`, `Tabs`.
- Form controls: `Input` (icons, affixes, `Input.Action`, `endButton`), `Textarea`, `ComboBox` (type to filter; `multiple`, each choice a removable chip, the field growing onto new lines; `loadOptions` to search an API as you type), `Checkbox`, `Segmented`.
- Display and feedback: `Alert`, `Chip` and `Chip.Group`, `Collapsible`, `Spinner`.
- One icon per status tone, shared by `Alert`, `Button`, `Card`, `Chip` and `Menu.Item`, so a status is never carried by color alone: nine of the fifteen tone pairs are indistinguishable in greyscale. `neutral` and `accent` have none; the caller can replace the icon or remove it with `false`.
- Theming: `ThemeProvider` and `useTheme` (light, dark, system; controlled or uncontrolled), `ThemeScript` to avoid the flash on first paint, and the `--rv-*` design tokens. A `data-theme` section themes the lists of `ComboBox` and `Menu` opened inside it, although they are portalled out of it.
- `RelievoProvider`, to render links through the app's router link.
- Geist as the typeface, through `@fontsource-variable/geist`.
- Components usable from Server Components, dot notation included (`<Card.Body>`).
