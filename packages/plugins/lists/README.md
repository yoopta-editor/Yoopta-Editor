# @yoopta/lists

List block plugins for Yoopta Editor: **NumberedList**, **BulletedList**, **TodoList**. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/lists
```

## Usage

Pass the plugins to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';

const plugins = [NumberedList, BulletedList, TodoList];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, NumberedList, BulletedList, TodoList, /* ... */]);
```

## Default options

| Plugin        | Title          | Shortcuts |
| ------------- | -------------- | --------- |
| NumberedList  | Numbered List  | `['1.']`  |
| BulletedList  | Bulleted List  | `['-']`   |
| TodoList      | Todo List      | `['[]']`  |

## Extend

```tsx
NumberedList.extend({
  elements: {
    'numbered-list': { render: (props) => <YourNumberedList {...props} /> },
  },
  options: {
    display: { title: 'Numbered List', description: 'Create list with numbering' },
    shortcuts: ['1.'],
  },
});
```

## Classnames

- **NumberedList:** `.yoopta-numbered-list`, `.yoopta-numbered-list-count`, `.yoopta-numbered-list-content`
- **BulletedList:** `.yoopta-bulleted-list`, `.yoopta-bulleted-list-bullet`, `.yoopta-bulleted-list-content`
- **TodoList:** `.yoopta-todo-list`, `.yoopta-todo-list-checkbox`, `.yoopta-todo-list-content`

See [Lists plugin docs](https://docs.yoopta.dev/plugins/lists).
