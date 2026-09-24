# Contributing to Relievo

Thanks for your interest. Relievo is a small, opinionated design system: a few conventions keep it coherent, and they are worth reading before you send a change.

## Getting started

You need Node 22 and [pnpm](https://pnpm.io/) (the version is pinned in `package.json`).

```bash
pnpm install
pnpm storybook
```

Storybook runs at http://localhost:6006. Every component has stories there, and the Overview story shows them all together. Switch between the light and dark themes from the toolbar.

## Before you open a pull request

Run these three commands. CI runs the same ones on every pull request.

```bash
pnpm typecheck
pnpm test
pnpm build
```

A change is expected to come with:

- **Tests** next to the component (`<Name>.test.tsx`), written the way a user sees the DOM: query by role and accessible name, interact with `userEvent`.
- **Stories** for what you add, including `Controlled` and `Uncontrolled` ones for stateful components.
- **JSDoc** on every public prop, with `@default` when it has one: the API tables in Storybook are generated from it.
- **Both themes checked** for anything visual, with contrast measured rather than eyeballed. [`docs/contributing.md`](docs/contributing.md) has the recipe for screenshots.

## Conventions

The full list is in [`AGENTS.md`](AGENTS.md). The ones that matter most:

- No `className`, `style` or `render` on components. Customisation goes through `tone`, `variant`, `size` and tokens.
- Colors, shadows and spacing come from `--rv-*` tokens, never literals.
- Stateful components work both controlled and uncontrolled (`value` / `defaultValue` / `onValueChange`).
- Icons are elements (`startIcon={<PlusIcon />}`), Phosphor in the `bold` weight.
- Text reaches 4.5:1 contrast, and selection never relies on color alone.

## Design decisions

The look of the kit is decided by the maintainer. For anything that changes how a component looks or behaves, open an issue first with the options you see and the one you recommend, ideally with a mockup. Bug fixes, tests, documentation and accessibility improvements can go straight to a pull request.

## Commits and pull requests

- Write code, comments, docs and commit messages in English.
- One commit per topic, with a short imperative summary line (`Add a padding prop to Card`) and a body that says why.
- Keep a pull request to one topic, and describe what changed and how you checked it.

## License

By contributing, you agree that your contribution is licensed under the [MIT license](LICENSE) of the project.
