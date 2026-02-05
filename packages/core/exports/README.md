# @yoopta/exports

Export and import Yoopta content in different formats. Supports **HTML**, **Markdown**, and **plain text**. Use with the editor instance from `createYooptaEditor`; content is read via `editor.getEditorValue()` and set via `editor.setEditorValue()`.

## Installation

```bash
yarn add @yoopta/exports
```

## Usage

Create the editor with `createYooptaEditor({ plugins, marks })` and pass the **editor** (not plugins) to the component. Use the editor instance for get/set value.

### HTML

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { html } from '@yoopta/exports';

const Editor = () => {
  const editor = useMemo(() => createYooptaEditor({ plugins: PLUGINS, marks: MARKS }), []);

  const deserializeHTML = () => {
    const content = html.deserialize(editor, '<h1>First title</h1>');
    editor.setEditorValue(content);
  };

  const serializeHTML = () => {
    const data = editor.getEditorValue();
    const htmlString = html.serialize(editor, data);
    console.log(htmlString);
  };

  return (
    <div>
      <button onClick={deserializeHTML}>Load from HTML</button>
      <button onClick={serializeHTML}>Export to HTML</button>
      <YooptaEditor editor={editor} onChange={() => {}} />
    </div>
  );
};
```

### Markdown

```tsx
import { markdown } from '@yoopta/exports';

const deserializeMarkdown = () => {
  const value = markdown.deserialize(editor, '# First title');
  editor.setEditorValue(value);
};

const serializeMarkdown = () => {
  const data = editor.getEditorValue();
  const md = markdown.serialize(editor, data);
  console.log(md);
};
```

### Plain text

```tsx
import { plainText } from '@yoopta/exports';

const deserializeText = () => {
  const value = plainText.deserialize(editor, 'Some plain text');
  editor.setEditorValue(value);
};

const serializeText = () => {
  const data = editor.getEditorValue();
  const text = plainText.serialize(editor, data);
  console.log(text);
};
```

## API

- **`html.deserialize(editor, htmlString)`** — HTML string → Yoopta content
- **`html.serialize(editor, content)`** — Yoopta content → HTML string
- **`markdown.deserialize(editor, markdownString)`** — Markdown → Yoopta content
- **`markdown.serialize(editor, content)`** — Yoopta content → Markdown string
- **`plainText.deserialize(editor, text)`** — Plain text → Yoopta content
- **`plainText.serialize(editor, content)`** — Yoopta content → plain text

See [docs](https://docs.yoopta.dev) and the main [README](https://github.com/Darginec05/Yoopta-Editor) for full editor setup.
