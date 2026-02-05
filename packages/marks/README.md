# @yoopta/marks

Text formatting marks for Yoopta Editor: bold, italic, underline, strike, code, highlight, and support for custom marks. Pass marks to `createYooptaEditor({ marks })`; use the **Marks** namespace from `@yoopta/editor` to toggle or query marks in your UI.

## Installation

```bash
yarn add @yoopta/marks
```

## Usage

Register marks when creating the editor. Do **not** pass marks to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor, Marks } from '@yoopta/editor';
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks';

const marks = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

export default function Editor() {
  const editor = useMemo(
    () => createYooptaEditor({ plugins: PLUGINS, marks }),
    [],
  );

  return (
    <YooptaEditor editor={editor} onChange={() => {}}>
      {/* In toolbar: Marks.toggle(editor, { type: 'bold' }), Marks.isActive(editor, { type: 'bold' }) */}
    </YooptaEditor>
  );
}
```

## Built-in marks

| Mark       | Type        | Hotkey           |
| ---------- | ----------- | ---------------- |
| **Bold**   | `bold`      | Cmd/Ctrl + B     |
| **Italic** | `italic`    | Cmd/Ctrl + I     |
| **Underline** | `underline` | Cmd/Ctrl + U  |
| **Strike** | `strike`    | Cmd/Ctrl + Shift + S |
| **Code**   | `code`      | Cmd/Ctrl + E     |
| **Highlight** | `highlight` | (toolbar; supports colors) |

## Marks API

Use the `Marks` namespace from `@yoopta/editor` (not on the editor instance):

```tsx
import { Marks } from '@yoopta/editor';

Marks.toggle(editor, { type: 'bold' });
Marks.isActive(editor, { type: 'bold' });
Marks.add(editor, { type: 'highlight', value: { color: '#fef08a' } });
Marks.getValue(editor, { type: 'highlight' });
Marks.remove(editor, { type: 'bold' });
Marks.clear(editor);
```

See [Marks overview](https://docs.yoopta.dev/marks/overview) and [Marks API reference](https://docs.yoopta.dev/api-reference/marks) for options (`at`, `blockId`, etc.) and custom marks.
