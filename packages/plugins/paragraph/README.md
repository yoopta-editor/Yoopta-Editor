# @yoopta/paragraph

Default paragraph (text) block plugin for Yoopta Editor. Use it headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/paragraph
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';

const plugins = [Paragraph];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, /* ... */]);
```

Or extend a single plugin: `Paragraph.extend({ elements: ParagraphUI })` with `ParagraphUI` from `@yoopta/themes-shadcn/paragraph`.

## Default options

- **display:** title `'Text'`, description `'Start writing plain text.'`
- **shortcuts:** `['p', 'text']`

## Extend

```tsx
Paragraph.extend({
  elements: {
    paragraph: { render: (props) => <YourParagraph {...props} /> },
  },
  options: {
    shortcuts: ['para'],
    display: { title: 'Paragraph', description: 'Your description' },
    HTMLAttributes: { className: 'my-paragraph' },
  },
});
```

## Classnames

- `.yoopta-paragraph` — root element

See [Paragraph plugin docs](https://docs.yoopta.dev/plugins/paragraph) and [Core plugins](https://docs.yoopta.dev/core/plugins).
