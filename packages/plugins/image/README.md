# @yoopta/image

Image block plugin for Yoopta Editor. Renders image blocks with optional caption, alignment, and upload/URL handling. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/image
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Image from '@yoopta/image';

const plugins = [Image];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Image, /* ... */]);
```

Or: `Image.extend({ elements: ImageUI })` with `ImageUI` from `@yoopta/themes-shadcn/image`.

## Plugin options

You can pass options when extending, e.g. `onUpload`, `onError`, or custom upload handler. See the package types and [Image plugin docs](https://docs.yoopta.dev/plugins/image).

## Extend

```tsx
Image.extend({
  elements: {
    image: { render: (props) => <YourImageBlock {...props} /> },
  },
  options: {
    display: { title: 'Image', description: 'Add an image' },
  },
});
```

See [Image plugin docs](https://docs.yoopta.dev/plugins/image).
