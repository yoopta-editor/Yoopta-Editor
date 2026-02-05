# Yoopta Editor — Development playground

Next.js app for developing and testing Yoopta Editor packages locally. Use it to try plugins, UI components, themes, and the editor API without publishing.

## Running the dev server

From the **monorepo root**:

```bash
yarn install
yarn dev
```

This runs the configured packages in watch mode and starts the Next.js dev server. To limit which packages are watched:

```bash
PACKAGES="@yoopta/editor @yoopta/paragraph @yoopta/ui" yarn dev
```

Open the dev app (e.g. [http://localhost:3000](http://localhost:3000) or the port shown) and use the dev page to test the editor.

## Structure

- **Pages** — Next.js pages under `src/pages` (e.g. dev index for the main editor demo).
- **Components** — Local wrappers and examples that import from `@yoopta/editor`, `@yoopta/ui`, and plugin/theme packages.
- **Utils** — Default value, plugin lists, marks, and other shared config for the playground.

## Links

- [Main README](https://github.com/Darginec05/Yoopta-Editor) — Installation, quick start, API
- [Documentation](https://docs.yoopta.dev) — Full docs and examples
