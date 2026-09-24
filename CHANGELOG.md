# Changelog

All notable changes to Relievo are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/) as described in [`docs/releasing.md`](docs/releasing.md).

## [Unreleased]

The first release will be 0.1.0. What it contains:

### Added

- Layout: `Box`, `Stack`, `Card` (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Body`, `Card.Footer`, tones, `outline` variant, `padding`).
- Actions and navigation: `Button` (as a link with `href`, icons), `ButtonGroup`, `Link`, `Menu` (groups, separators, submenus, checkable items), `Pagination`, `Tabs`.
- Form controls: `Input` (icons, affixes, `Input.Action`, `endButton`), `Textarea`, `Select`, `Checkbox`, `Segmented`.
- Display and feedback: `Alert`, `Chip` and `Chip.Group`, `Collapsible`, `Spinner`.
- Theming: `ThemeProvider` and `useTheme` (light, dark, system; controlled or uncontrolled), `ThemeScript` to avoid the flash on first paint, and the `--rv-*` design tokens.
- `RelievoProvider`, to render links through the app's router link.
- Geist as the typeface, through `@fontsource-variable/geist`.
- Components usable from Server Components, dot notation included (`<Card.Body>`).
