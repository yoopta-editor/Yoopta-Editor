# @yoopta/headings

Heading block plugins for Yoopta Editor: **HeadingOne**, **HeadingTwo**, **HeadingThree**. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/headings
```

## Usage

Pass the plugins to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';

const plugins = [HeadingOne, HeadingTwo, HeadingThree];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
]);
```

## Default options

| Plugin       | Title       | Shortcuts   |
| ------------ | ----------- | ----------- |
| HeadingOne   | Heading 1   | `['h1', '#', '*']` |
| HeadingTwo   | Heading 2   | `['h2', '##']`     |
| HeadingThree | Heading 3   | `['h3', '###']`    |

## Extend

```tsx
HeadingOne.extend({
  elements: {
    'heading-one': { render: (props) => <YourH1 {...props} /> },
  },
  options: {
    shortcuts: ['h1', 'title'],
    display: { title: 'Heading 1', description: 'Big section heading' },
    HTMLAttributes: { className: 'my-heading-one' },
  },
});
```

## Classnames

- `.yoopta-heading-one`, `.yoopta-heading-two`, `.yoopta-heading-three`

See [Headings plugin docs](https://docs.yoopta.dev/plugins/headings) and [Core plugins](https://docs.yoopta.dev/core/plugins).
