# @yoopta/code

Code block plugin for Yoopta Editor. Renders code blocks with optional language and theme (e.g. for syntax highlighting). Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/code
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Code from '@yoopta/code';

const plugins = [Code];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Code, /* ... */]);
```

Or: `Code.extend({ elements: CodeUI })` with `CodeUI` from `@yoopta/themes-shadcn/code`.

## Extend

```tsx
Code.extend({
  elements: {
    code: { render: (props) => <YourCodeBlock {...props} /> },
  },
  options: {
    display: { title: 'Code', description: 'Code block' },
    shortcuts: ['code', '```'],
  },
});
```

## Docs

See [Code plugin docs](https://docs.yoopta.dev/plugins/code) and [Code group](https://docs.yoopta.dev/plugins/code-group).
