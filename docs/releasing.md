# Releasing

How versions are numbered, how changes are recorded, and the steps to publish.

## Versioning

Relievo follows [Semantic Versioning](https://semver.org/). While the major version is 0 the API is not stable, so the usual rules shift one place:

| Version bump | 0.x                                          | From 1.0.0                        |
| ------------ | -------------------------------------------- | --------------------------------- |
| Major        | (reserved for 1.0.0, the API is declared stable) | A breaking change                 |
| Minor        | A breaking change, or a new feature          | A new feature, backwards compatible |
| Patch        | A fix, or a small backwards-compatible addition | A fix                             |

What counts as breaking, because apps depend on it:

- A prop renamed or removed, a value dropped from a prop's type, or a default that changes what a component does.
- A component or a named export renamed or removed.
- A `--rv-*` token renamed or removed. Tokens are the way apps customise the kit.
- A change of the peer dependency range (`react`, `react-dom`, `@phosphor-icons/react`).

A change in the look of a component (colors, relief, spacing) is not breaking, but it is recorded under **Changed** so that an app can check it. When something has to go, mark it `@deprecated` in its JSDoc and in the changelog one release before removing it, whenever that is possible.

## The changelog

[`CHANGELOG.md`](../CHANGELOG.md) is written by hand, for the people who use the kit rather than the ones who build it.

- Every user-visible change adds a line to the **Unreleased** section, in the same commit as the change. Group lines under **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed** or **Security**.
- One line says what changed for a user, in the words of the API (`Card` takes a `padding` prop), not what the commit did.
- Refactors, tests, documentation and tooling do not need a line.

## Publishing a release

0. Nothing is published yet: `package.json` is `private`, which makes `pnpm publish` refuse. Remove `"private": true` for the first publication.
1. Check that `main` is green on CI and that **Unreleased** in `CHANGELOG.md` says what the release holds.
2. In `CHANGELOG.md`, rename **Unreleased** to the new version with its date (`## [0.2.0] - 2026-10-15`) and add an empty **Unreleased** section above it. Once the first tag exists, also add the comparison links at the bottom of the file.
3. Set the version and commit:

   ```bash
   npm version <version> --no-git-tag-version
   git commit -am "Release v<version>"
   ```

4. Tag it and push both:

   ```bash
   git tag v<version>
   git push origin main --tags
   ```

5. Publish to npm. `prepublishOnly` runs the type-check, the lint, the tests and the build first:

   ```bash
   pnpm publish
   ```

6. Create the GitHub release, with the changelog section as its notes:

   ```bash
   gh release create v<version> --title v<version> --notes "<the section of CHANGELOG.md>"
   ```

A version already on npm is never changed: a mistake is fixed with the next patch.
