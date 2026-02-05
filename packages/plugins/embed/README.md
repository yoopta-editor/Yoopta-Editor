# @yoopta/embed

Embed block plugin for Yoopta Editor. Renders embed blocks for URLs (e.g. YouTube, Vimeo, Twitter, Figma). Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/embed
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Embed from '@yoopta/embed';

const plugins = [Embed];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Embed, /* ... */]);
```

Or: `Embed.extend({ elements: EmbedUI })` with `EmbedUI` from `@yoopta/themes-shadcn/embed`.

## Extend

```tsx
Embed.extend({
  elements: {
    embed: { render: (props) => <YourEmbedBlock {...props} /> },
  },
  options: {
    display: { title: 'Embed', description: 'Embed a link' },
  },
});
```

See [Embed plugin docs](https://docs.yoopta.dev/plugins/embed).
