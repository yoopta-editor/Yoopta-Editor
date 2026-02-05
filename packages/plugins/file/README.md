# @yoopta/file

File block plugin for Yoopta Editor. Renders file blocks (upload or link) with optional caption and download. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/file
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import File from '@yoopta/file';

const plugins = [File];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, File, /* ... */]);
```

Or: `File.extend({ elements: FileUI })` with `FileUI` from `@yoopta/themes-shadcn/file`.

## Plugin options

Options may include upload handler, `onError`, etc. See the package types and [File plugin docs](https://docs.yoopta.dev/plugins/file).

## Extend

```tsx
File.extend({
  elements: {
    file: { render: (props) => <YourFileBlock {...props} /> },
  },
  options: {
    display: { title: 'File', description: 'Add a file' },
  },
});
```

See [File plugin docs](https://docs.yoopta.dev/plugins/file).
