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

1. **Build the Project**: Before beginning active development, ensure all packages are built by running:

```bash
  yarn build
```

2. **Start Development Mode for Specific Packages**: You can specify which packages to run in watch mode. This helps you focus on the specific packages you're working on. Use the following command:

```bash
  PACKAGES="<package names>" yarn dev
```

For example, to run only the `@yoopta/editor` and `@yoopta/paragraph` packages:

```bash
PACKAGES="@yoopta/editor @yoopta/paragraph" yarn dev
```

3. Find the editor initializer code in `./packages/development/src/pages/dev/index.tsx` and you are ready for development

## Project structure

```text
packages/
├── core - core components of the editor
├── marks - text marks
├── plugins - editor plugin extensions
├── tools - tools packages
└── development - developer playground
web/next-example - all examples
```
