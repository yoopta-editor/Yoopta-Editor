# Contributing

[fork]: /fork
[pr]: /compare
[style]: https://standardjs.com/
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project, you agree to abide by its terms.

## Issues and PRs

If you have suggestions for how this project could be improved or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it! Look at the links below if you're not sure how to open a PR.

## Starting Development

To start contributing to the project, follow these steps:

1. **Install dependencies and build all packages**:

```bash
yarn install
yarn build
```

2. **Start the dev server**:

```bash
yarn dev
```

This starts the Next.js app at `web/next-app-example`. It imports `@yoopta/*` packages from their pre-built `dist/` folders.

3. **Watch specific packages you're working on** (recommended):

```bash
yarn dev --filter=@yoopta/editor --filter=@yoopta/paragraph
```

This starts the dev server **and** runs rollup in watch mode for the specified packages. When you edit a package's source, rollup rebuilds its `dist/` and Next.js picks up the change via HMR.

Only watch the packages you're actively changing — this keeps startup fast and CPU usage low.

4. **Build a single package**:

```bash
yarn build --filter=@yoopta/editor
```

5. Find the editor code in `./web/next-app-example` and you are ready for development.

## Project structure

```text
packages/
├── core/        - core components (editor, ui, exports, collaboration)
├── marks/       - text formatting marks
├── plugins/     - editor plugin extensions
├── themes/      - theme packages (base, material, shadcn)
web/
└── next-app-example - development playground and examples
```

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing:

1. `yarn changeset` — create a changeset describing your change
2. `yarn version` — bump versions and update changelogs
3. `yarn release` — build and publish to npm
