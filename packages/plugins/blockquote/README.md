# @yoopta/blockquote

Blockquote plugin for Yoopta Editor. Renders quote blocks; use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/blockquote
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Blockquote from '@yoopta/blockquote';

const plugins = [Blockquote];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

Use Shadcn theme for styled blockquotes:

```tsx
import Blockquote from '@yoopta/blockquote';
import { BlockquoteUI } from '@yoopta/themes-shadcn/blockquote';

const BlockquoteWithUI = Blockquote.extend({ elements: BlockquoteUI });
const plugins = [BlockquoteWithUI];
```

## Default options

- **display:** title `'Blockquote'`, description `'Capture quote'`
- **shortcuts:** `['>']`

## Extend

```tsx
Blockquote.extend({
  elements: {
    blockquote: { render: (props) => <YourCustomBlockquote {...props} /> },
  },
  options: {
    shortcuts: ['quote'],
    display: { title: 'Quote', description: 'Your description' },
    HTMLAttributes: { className: 'my-blockquote' },
  },
});
```

## Classnames

- `.yoopta-blockquote` — root element

See [Blockquote plugin docs](https://docs.yoopta.dev/plugins/blockquote).
