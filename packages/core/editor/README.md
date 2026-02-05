# @yoopta/editor

Core headless package for Yoopta Editor. Provides the editor instance, block/element/mark logic, and React component. Plugins and marks are passed to `createYooptaEditor`; UI (toolbars, slash menu, block actions) is rendered as **children** of `<YooptaEditor>` from `@yoopta/ui`.

## Installation

```bash
yarn add slate slate-react slate-dom @yoopta/editor
```

Peer dependencies: `slate`, `slate-react`, `slate-dom`.

## Quick Start

Plugins, marks, and optional initial value are passed to `createYooptaEditor`. The component receives only the `editor` instance and callbacks.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor, type YooptaContentValue } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { Bold, Italic } from '@yoopta/marks';

const plugins = [Paragraph];
const marks = [Bold, Italic];
const initialValue = {} as YooptaContentValue;

export default function Editor() {
  const editor = useMemo(
    () => createYooptaEditor({ plugins, marks, value: initialValue }),
    [],
  );

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type / to open menu"
      onChange={(value) => console.log(value)}
    />
  );
}
```

To add toolbar and slash menu, install `@yoopta/ui` and render them as **children** of `<YooptaEditor>`:

```tsx
import { FloatingToolbar, FloatingBlockActions, SlashCommandMenu } from '@yoopta/ui';

<YooptaEditor editor={editor} onChange={onChange} placeholder="Type / to open menu">
  <FloatingToolbar />
  <FloatingBlockActions />
  <SlashCommandMenu />
</YooptaEditor>
```

## YooptaEditor props

| Prop | Type | Description |
|------|------|-------------|
| `editor` | `YooEditor` | **Required.** Instance from `createYooptaEditor`. |
| `onChange` | `(value, options) => void` | Called when content changes. |
| `onPathChange` | `(path) => void` | Called when the current block path changes. |
| `autoFocus` | `boolean` | Focus editor on mount. Default: `true`. |
| `className` | `string` | Additional CSS class (default: `.yoopta-editor`). |
| `style` | `CSSProperties` | Inline styles (e.g. `{ width: 750, paddingBottom: 100 }`). |
| `placeholder` | `string` | Placeholder when the editor is empty. |
| `children` | `ReactNode` | UI components (toolbar, slash menu, block actions, etc.). |
| `renderBlock` | `(props) => ReactNode` | Custom wrapper per block (e.g. for drag-and-drop). |

Initial content is set via `createYooptaEditor({ value })` or later with `editor.setEditorValue(value)`. Do not pass `plugins`, `marks`, or `value` to `<YooptaEditor>`.

## createYooptaEditor options

```ts
createYooptaEditor({
  plugins: YooptaPlugin[];   // required
  marks?: YooptaMark[];      // optional
  value?: YooptaContentValue;
  readOnly?: boolean;
  id?: string;
});
```

## Editor API (YooEditor)

- **Content:** `getEditorValue()`, `setEditorValue(value)`
- **Blocks:** `insertBlock`, `updateBlock`, `deleteBlock`, `duplicateBlock`, `toggleBlock`, `moveBlock`, `focusBlock`, `mergeBlock`, `splitBlock`, `increaseBlockDepth`, `decreaseBlockDepth`, `getBlock`
- **Transforms:** `applyTransforms([{ type: 'validate_block_paths' }])`
- **History:** `undo()`, `redo()`, `batchOperations(fn)`
- **Events:** `on`, `off`, `once`, `emit` — events: `change`, `focus`, `blur`, `path-change`, `block:copy`
- **Parsers:** `getHTML(value)`, `getMarkdown(value)`, `getPlainText(value)`, `getEmail(value, options)`
- **Focus:** `focus()`, `blur()`, `isFocused()`
- **Element builder:** `editor.y` for building block/element structures programmatically

## Namespace APIs

Use these for programmatic control (e.g. inside toolbar or custom UI):

```ts
import { Blocks, Elements, Marks, Selection } from '@yoopta/editor';

// Block operations
Blocks.insertBlock(editor, { ... });
Blocks.updateBlock(editor, { ... });
Blocks.deleteBlock(editor, { ... });
Blocks.getBlock(editor, { id: blockId });

// Element operations (within a block)
Elements.insertElement(editor, { ... });
Elements.updateElement(editor, { ... });
Elements.getElement(editor, { ... });

// Text formatting (marks)
Marks.toggle(editor, { type: 'bold' });
Marks.isActive(editor, { type: 'bold' });
```

## Hooks

Must be used inside a component that is a **child** of `<YooptaEditor>` (e.g. inside toolbar or block actions).

| Hook | Description |
|------|-------------|
| `useYooptaEditor()` | Returns the editor instance. |
| `useYooptaReadOnly()` | Returns whether the editor is read-only. |
| `useYooptaFocused()` | Returns whether the editor is focused. |
| `useBlockData(blockId)` | Returns block data for the given `blockId`. |
| `useYooptaPluginOptions(blockType)` | Returns options for the plugin of the given block type. |

## Related packages

- **@yoopta/ui** — FloatingToolbar, SlashCommandMenu, FloatingBlockActions, BlockOptions, SelectionBox, BlockDndContext, SortableBlock
- **@yoopta/themes-shadcn** — Styled block UI; use `applyTheme(plugins)` or extend a single plugin with theme elements
- **@yoopta/marks** — Bold, Italic, Underline, Strike, CodeMark, Highlight, etc.
- **@yoopta/paragraph**, **@yoopta/headings**, **@yoopta/code**, etc. — Block plugins

See the [main README](https://github.com/Darginec05/Yoopta-Editor) and [Quickstart](https://docs.yoopta.dev/quickstart) for full setup with themes and UI.
