# V6 Changes

Major version with significant API and architectural changes

---

## Summary

- **Editor creation**: Plugins and marks are passed to `createYooptaEditor()`, not to `<YooptaEditor>`.
- **Content**: No `value` / `onChange` controlled pattern on the component; use `editor.setEditorValue()` / `editor.getEditorValue()` and `onChange` callback.
- **UI**: All UI (toolbar, slash menu, block actions, etc.) are **children** of `<YooptaEditor>` and use `useYooptaEditor()` from context.
- **Packages**: Headless core, separate `@yoopta/ui`, themes (`@yoopta/themes-shadcn`), namespace APIs (`Blocks`, `Elements`, `Marks`, `Selection`).
- [**Docs & examples**](https://docs.yoopta.dev/introduction): Documentation and examples updated for the new API.

---

## Breaking changes

### 1. Editor creation and YooptaEditor props

**Before (master / 4.9.x):**

```tsx
const editor = useMemo(() => createYooptaEditor(), []);

<YooptaEditor
  editor={editor}
  plugins={plugins}
  marks={marks}
  value={value}
  onChange={setValue}
  placeholder="..."
/>;
```

**After (v6):**

```tsx
const editor = useMemo(() => createYooptaEditor({ plugins, marks }), []);

// Initial or loaded content: set imperatively
useEffect(() => {
  editor.setEditorValue(initialValue);
}, [editor]);

<YooptaEditor
  editor={editor}
  onChange={(value) => {
    /* persist or setState */
  }}
  placeholder="Type / to open menu...">
  {/* UI components as children */}
</YooptaEditor>;
```

- `plugins` and `marks` are **required** in `createYooptaEditor({ plugins, marks })` and must **not** be passed to `<YooptaEditor>`.
- `value` is **not** a prop of `<YooptaEditor>`. Use `editor.setEditorValue(data)` for initial/loaded content and `onChange` to react to changes.
- To read content: `editor.getEditorValue()` (or use the value passed to `onChange`).

### 2. Optional initial value at creation

You can still pass initial content when creating the editor:

```tsx
createYooptaEditor({ plugins, marks, value: initialContent, readOnly: false });
```

Or set it later in `useEffect` with `editor.setEditorValue(initialContent)`.

### 3. UI components as children

**Before (master):** Tools or toolbar could be passed as props or a separate layer.

**After (v6):** All UI that needs the editor must be **children** of `<YooptaEditor>` so they can use `useYooptaEditor()`:

```tsx
<YooptaEditor editor={editor} onChange={onChange} placeholder="...">
  <FloatingToolbar />
  <FloatingBlockActions />
  <SlashCommandMenu />
  <SelectionBox selectionBoxElement={containerRef} />
</YooptaEditor>
```

- `FloatingToolbar`, `ActionMenuList`, `SlashCommandMenu`, `FloatingBlockActions`, `BlockOptions`, `SelectionBox` come from `@yoopta/ui`.
- For drag-and-drop: wrap with `BlockDndContext` and use `renderBlock` with `SortableBlock` (and optional `DragHandle`).

### 4. Deprecated / removed patterns

- **`@yoopta/tools`** (e.g. `ActionMenuTool`, `Toolbar`, `LinkTool`): deprecated; use components from `@yoopta/ui` instead.
- **`<YooptaEditor tools={[...]} />`**: no longer supported; use children as above.
- **`value` / controlled value on `<YooptaEditor>`**: removed; use `setEditorValue` + `onChange`.

---

## New or changed API

### createYooptaEditor(options)

- **`plugins`** (required): array of plugin instances.
- **`marks`** (optional): array of mark types (e.g. Bold, Italic).
- **`value`** (optional): initial `YooptaContentValue`.
- **`readOnly`** (optional): boolean.
- **`id`** (optional): custom editor id.

### YooptaEditor props

- **`editor`** (required): instance from `createYooptaEditor`.
- **`onChange`** (optional): `(value: YooptaContentValue, options: { operations }) => void`.
- **`onPathChange`** (optional): `(path: YooptaPath) => void`.
- **`placeholder`**, **`autoFocus`**, **`className`**, **`style`**, **`renderBlock`**, **`children`**.

No `plugins`, `marks`, or `value`.

### Editor instance

- **`editor.getEditorValue()`**: returns current `YooptaContentValue`.
- **`editor.setEditorValue(value)`**: sets content (e.g. after load).
- **`editor.applyTransforms([{ type: 'validate_block_paths' }])`**: optional after `setEditorValue` to normalize paths.
- **Events**: `editor.on('change', fn)`, `editor.off('change', fn)`, same for `path-change`, etc.
- **Block operations**: `insertBlock`, `deleteBlock`, `updateBlock`, `toggleBlock`, `moveBlock`, `focusBlock`, etc.
- **Elements**: `insertElement`, `updateElement`, `deleteElement`, `getElement`, `getElements`, etc.
- **Parsers**: `getHTML`, `getMarkdown`, `getPlainText`, `getEmail` (each can take value or use current).
- **History**: `undo`, `redo`, `batchOperations`.

### Namespace APIs (optional usage)

From `@yoopta/editor` you can use:

- **`Blocks.*`**: `Blocks.insertBlock(editor, ...)`, `Blocks.deleteBlock(editor, ...)`, etc.
- **`Elements.*`**: `Elements.insertElement(editor, ...)`, etc.
- **`Marks.*`**: `Marks.toggle(editor, { type: 'bold' })`, etc.
- **`Selection.*`**: selection helpers.

These mirror methods on the editor instance.

---

## UI package (@yoopta/ui)

- **FloatingToolbar** — formatting toolbar (compound: Content, Group, Button, Separator).
- **ActionMenuList** — “Turn into” / block type menu (controlled: `open`, `onOpenChange`, `anchor`).
- **SlashCommandMenu** — slash “/” command menu (compound: Content, List, Item, Empty, Footer).
- **FloatingBlockActions** — hover actions per block (render props with `blockId`).
- **BlockOptions** — block context menu (Duplicate, Delete, Turn into, etc.).
- **SelectionBox** — rectangle selection for multiple blocks (`selectionBoxElement` = container ref).
- **BlockDndContext**, **SortableBlock**, **DragHandle** — drag-and-drop reorder.

All of these are used as **children** of `<YooptaEditor>` and rely on `useYooptaEditor()`.

---

## Themes

The editor and plugins are **headless** by default. Theme packages provide optional UI for plugin elements. Available: **`@yoopta/themes-shadcn`** (production), **`@yoopta/themes-material`** (in progress).

**Two ways to use theme UI:**

1. **Apply to all plugins** — `applyTheme(plugins)` returns plugins with theme-styled elements. Use: `createYooptaEditor({ plugins: applyTheme(plugins), marks })`.
2. **Apply to a single plugin** — import the theme UI for that plugin and extend: e.g. `import { CalloutUI } from '@yoopta/themes-shadcn/callout'; Callout.extend({ elements: CalloutUI })`.

CSS is applied by the theme package; no need to pass `plugins`/`marks` to `<YooptaEditor>`.

---

## Package and repo structure

- **Core**: `@yoopta/editor` (headless), `@yoopta/ui` (UI components), `@yoopta/exports` (serializers).
- **Plugins**: e.g. `@yoopta/paragraph`, `@yoopta/headings`, `@yoopta/code`, `@yoopta/table`, etc.
- **Marks**: `@yoopta/marks` (Bold, Italic, Underline, etc.).
- **Themes**: `@yoopta/themes-shadcn`, `@yoopta/themes-material` (in development).
- **Examples**: `web/next-app-example`, `web/vite-example`, `packages/development` (playground). Old `web/next-example` removed or replaced.

---

## [Yoopta Documentation](https://docs.yoopta.dev/introduction)

- **Getting started, quickstart, installation, introduction**: Updated to v6 API (`createYooptaEditor({ plugins, marks })`, `setEditorValue`, `onChange`, UI as children).
- **UI overview and per-component docs** (`docs/ui/*.mdx`): Updated to SlashCommandMenu, compound components, and correct usage (children, no `plugins`/`value` on `YooptaEditor`).
- **Mintlify docs**: Plugin previews and plugin playground (iframe) snippets; accordion and other plugin docs aligned with v6.

---

## Migration checklist (from 4.9.x to v6)

1. **Create editor** with `createYooptaEditor({ plugins, marks })` (and optional `value`, `readOnly`).
2. **Remove** `plugins`, `marks`, and `value` from `<YooptaEditor>`.
3. **Set initial content** with `editor.setEditorValue(data)` in `useEffect` (or pass `value` into `createYooptaEditor`).
4. **Keep** `onChange` on `<YooptaEditor>` and use it (and/or `editor.getEditorValue()`) for persistence.
5. **Move** toolbar, block menu, slash menu, block actions, etc. **inside** `<YooptaEditor>` as children.
6. **Replace** any `@yoopta/tools` usage with `@yoopta/ui` components (FloatingToolbar, ActionMenuList, SlashCommandMenu, etc.).
7. **Optional**: Use `applyTheme(plugins)` when using `@yoopta/themes-shadcn`.
8. **Optional**: Add `BlockDndContext`, `renderBlock` with `SortableBlock`, and `SelectionBox` as needed.

---

## Version

- **Branch**: `v6`
- **Package versions**: e.g. `6.0.0-beta.x` for core and related packages.

For detailed changelog entries, see `CHANGELOG.md` and other package CHANGELOGs.
