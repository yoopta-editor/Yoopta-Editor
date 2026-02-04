# Changelog

All notable changes to Yoopta Editor are documented in this file (monorepo single changelog).

---

## [6.0.0-beta.18] - 2026-02-04

### Fixed

- **FloatingBlockActions**: Fixed hover detection - users can now reliably reach floating actions when moving cursor from block to actions. Uses JavaScript-based extended bounds checking instead of CSS pseudo-elements.
- **FloatingToolbar (Safari)**: Fixed button clicks immediately closing the toolbar in Safari by adding `preventDefault()` on mouseDown.
- **HighlightColorPicker**: Fixed click-outside handling using FloatingOverlay approach for reliable behavior across browsers including Safari.
- **HighlightColorPicker**: Added debounce (300ms) to color picker onChange to prevent flooding undo/redo history with every color change.
- **SelectionBox**: Fixed native text selection appearing during programmatic block selection by preventing default and setting `user-select: none`.
- **Steps plugin**: Fixed buggy `moveUp` and `moveDown` methods - now properly uses `Transforms.moveNodes` and recalculates order values.
- **Inline toolbars positioning (Safari)**: Fixed image, file, embed, and video inline toolbars appearing at top-left corner (0,0) in Safari. Now uses `useLayoutEffect`, `isReady` state guard, and `FloatingPortal` for proper positioning.
- **Image resize handlers**: Added contrasting white ring (`ring-2 ring-white/80`) for visibility on dark images.
- **Image resize (left handle)**: Fixed buggy left-side resizing by anchoring position with `position={{ x: 0, y: 0 }}`.

### Changed

- **Code/CodeGroup themes**: Shiki theme colors now use scoped CSS variables on elements instead of global document variables for better isolation.

---

## [6.0.0] - 2026-01-28

Major version with significant API and architectural changes compared to 4.9.x.

### Summary

- **Editor creation**: `plugins` and `marks` are passed to `createYooptaEditor({ plugins, marks })`, not to `<YooptaEditor>`.
- **Content**: No `value`/`onChange` controlled pattern on the component; use `editor.setEditorValue()` / `editor.getEditorValue()` and `onChange` callback.
- **UI**: All UI (toolbar, slash menu, block actions, etc.) are **children** of `<YooptaEditor>` and use `useYooptaEditor()` from context.
- **Packages**: Headless core, separate `@yoopta/ui`, themes (`@yoopta/themes-shadcn`), namespace APIs (`Blocks`, `Elements`, `Marks`, `Selection`).
- **Docs & examples**: Documentation and examples updated for the new API.

### Breaking changes

- **Editor creation**: `createYooptaEditor({ plugins, marks })` is required; `plugins` and `marks` must not be passed to `<YooptaEditor>`.
- **Value**: `value` is not a prop of `<YooptaEditor>`. Use `editor.setEditorValue(data)` for initial/loaded content and `onChange` to react to changes. Read content via `editor.getEditorValue()` or the value passed to `onChange`.
- **UI as children**: Toolbar, ActionMenuList, SlashCommandMenu, FloatingBlockActions, BlockOptions, SelectionBox, etc. must be rendered as **children** of `<YooptaEditor>` (from `@yoopta/ui`). For drag-and-drop: wrap with `BlockDndContext` and use `renderBlock` with `SortableBlock`.
- **Deprecated/removed**: `@yoopta/tools` (use `@yoopta/ui`); `<YooptaEditor tools={[...]} />` (use children); `value` on `<YooptaEditor>` (use `setEditorValue` + `onChange`).

### New or changed API

- **createYooptaEditor(options)**: `plugins` (required), `marks` (optional), `value` (optional), `readOnly` (optional), `id` (optional).
- **YooptaEditor props**: `editor` (required), `onChange`, `onPathChange`, `placeholder`, `autoFocus`, `className`, `style`, `renderBlock`, `children`. No `plugins`, `marks`, or `value`.
- **Editor instance**: `getEditorValue()`, `setEditorValue(value)`, `applyTransforms([{ type: 'validate_block_paths' }])`, events (`on`/`off`), block operations, elements, parsers, history.
- **Namespace APIs** (from `@yoopta/editor`): `Blocks.*`, `Elements.*`, `Marks.*`, `Selection.*`.

### UI package (@yoopta/ui)

- FloatingToolbar, ActionMenuList, SlashCommandMenu, FloatingBlockActions, BlockOptions, SelectionBox, BlockDndContext, SortableBlock, DragHandle — all as children of `<YooptaEditor>`.

### Themes

- Editor and plugins are **headless**; theme packages provide optional UI for block elements. **`@yoopta/themes-shadcn`** (production), **`@yoopta/themes-material`** (in progress).
- **Apply to all plugins**: `applyTheme(plugins)` — use with `createYooptaEditor({ plugins: applyTheme(plugins), marks })`.
- **Apply to one plugin**: e.g. `import { CalloutUI } from '@yoopta/themes-shadcn/callout'; Callout.extend({ elements: CalloutUI })`.

### Package structure

- Core: `@yoopta/editor`, `@yoopta/ui`, `@yoopta/exports`. Plugins, marks, themes in separate packages. Examples: `web/next-app-example`, `web/vite-example`, `packages/development`.

### Migration (4.9.x → v6)

1. Create editor with `createYooptaEditor({ plugins, marks })`.
2. Remove `plugins`, `marks`, and `value` from `<YooptaEditor>`.
3. Set initial content with `editor.setEditorValue(data)` in `useEffect` or pass `value` into `createYooptaEditor`.
4. Keep `onChange` and use it (and/or `editor.getEditorValue()`) for persistence.
5. Move toolbar, block menu, slash menu, block actions inside `<YooptaEditor>` as children.
6. Replace `@yoopta/tools` with `@yoopta/ui` components.
7. Optionally use `applyTheme(plugins)` and add BlockDndContext / SortableBlock / SelectionBox as needed.

---

## [4.9.9] - 2025-06-11

### [Possible] Breaking Changes

- Removed unneccessary div from block render. It can affect on your styles. Recheck please

### Added

- `Added validations for element structures on each plugin level`
- `Vitest configuration is done`
- `Added tests for validations`

### Fixed

- `Fix issue where content is lost when pasting HTML containing marks or lists`
- `Deleted unneccessary div in block render by`

## [4.9.8] - 2025-05-28

### Added

- `Added classname when state is zoomed `

### Fixed

- `Fixed events for multiple editors by making them not global`

## [4.9.7] - 2025-04-20

### Fixed

- `Fixed bug with continutation numeric lists`
- `Fixed critical bug with the entire block text disappearing when switching to another block using the ActionMenu`
- `Fixed bug with slash commands. Slash symbol "/" is now deleted when selecting block`

## [4.9.6] - 2025-04-18

### Added

- `Toolbar opens when several blocks selected`
- `Added 'toggle_block' operation`
- `Added 'onError' handler for media plugins`

### Fixed

- `Fixed focus on empty block with placeholder`
- `Fixed bugs with toggleBlock when block has 0 order`
- `Fixed toggleBlock when it applies for several blocks`
- `Fixed bug for inlineVoid plugins(mentions)`

## [4.9.5] - 2025-04-13

### Added

- `Added zoom-in for images`

### Fixed

- `Fix losing focus bug for toolbar in Safari browsers`
- `Fix bugs when clicking on block actions: delete/duplicate/turnInto`
- `decrease dealy when selecting highlight color`
- `added type button to prevent form submit `

## [4.9.4] - 2025-01-01

### Added

- `Added color picker to highlight color`
- `Update UI for TodoList`
- `Added _onPathChange_ prop to <YooptaEditor />`

### Fixed

- `Fixed depth issues for Todo/Bulleted/Numbered lists`
- `Fixed indent for lists while serializing in markdown string`
- `Fixed firing _onDestroy_ event after delete block`

## [4.9.3] - 2024-12-27

### Added

- `Added icons to callout render`
- `Added **selection** of current block on *editor.path*`
- `Deserializer for images in markdown`
- `More video embed types (Loom & Wistia)`

## [4.9.2] - 2024-11-11

### Added

- `Added Email-Builder by @yoopta/email-builder`
- `Email export: accordion component by`
- `Feature/email builder resend integration`
- `Feature: email video export and thumbnail`
- `Add email export, implement export for paragraph and headings`

## [4.9.1] - 2024-10-31

### Added

- `Added supporting highlight colors when serialize/deserialize html`

### Fixed

- `Fixed searching in Action Menu List`
- `Fixed triggering Action Menu List by slash command`
- `Fixed `catastrophic backtracking` for regex url checking. Replaced it with validator-js`
- `Reducing size of `@yoopta/exports``
- `Fixed searching by shortcuts in Action Menu List`
- `Fixed styles for depth when serialize/deserialize html`
- `Fixed example with Medium toolbar`

## [4.9.0] - 2024-10-27

### Breaking Changes

- Changed API for `editor.on('change', changeHandler);`

```javascript
// before
editor.on('change', (value: YooptaChildrenValue) => {
  setValue(value);
});

// now
editor.on('change', (options: YooptaEventChangePayload) => {
  const { value, operations } = options;
  setValue(value);
});

// [!!!But I highly recommend start to use new `onChange` prop in <YooptaEditor value={value} onChange={newValue => setValue(newValue)} />;
```

### Added

> Undo/redo now available!

- New Editor API methods for history:
  - `editor.undo: ({ scroll?: boolean }?: UndoRedoOptions) => void`
  - `editor.redo: ({ scroll?: boolean }?: UndoRedoOptions) => void`
  - `editor.historyStack: Record`
  - `editor.withoutSavingHistory: (fn: () => void): void`
  - `editor.withSavingHistory: (fn: () => void): void`
  - `editor.isSavingHistory: (): boolean | undefined`
  - `editor.withoutMergingHistory: (fn: () => void): void`
  - `editor.withMergingHistory: (fn: () => void): void`
  - `editor.isMergingHistory: (): boolean | undefined`

> New powerful `editor.applyTransforms` method and `operations API.
`Now, every time the content is changed, the corresponding operation is called, which passes through the `editor.applyTransforms`

- `editor.path: YooptaPath`
- `editor.setPath: (path: YooptaPath) => void;`
- `Blocks.getBlock: (editor: YooEditor, options: GetBlockOptions) => YooptaBlockData`
- `Blocks.getBlockSlate: (editor: YooEditor, options: GetBlockSlateOptions) => SlateEditor`
- `Blocks.buildBlockData: (block?: BuildBlockDataOptions) => YooptaBlockData`
- `Blocks.mergeBlock: () => void`

```javascript
export type YooptaPath = {
  current: YooptaPathIndex, // current selected block
  selected?: number[] | null, // array of selected blocks
};
```

### Fixed

- `editor.toggleBlock` -fixed toggling between complex block elements
- `editor.splitBlock` - fixed split between complex block elements
- `onChange` now does not fire during initialization
- `editor.duplicateBlock` - fixed for Code block
- Fixed moving up/down cursor in list plugins
- Fixed trigger of "/" for `ActionMenu`

### Removed

- Editor API changes:
  - `editor.applyChanges` - removed
  - `editor.selection` - removed (changed to `editor.path`)
  - `editor.setSelection` - removed (changed to `editor.setPath`)
  - `editor.setBlockSelected` - removed (changed to `editor.setPath`)
  - `editor.insertBlocks` - removed
  - `editor.deleteBlocks` - removed
  - `editor.createBlock` - removed. Use `editor.insertBlock` instead

### Examples

- Added new example for `operations` API
- Added new example for `undo/redo`
- Updated UI for HTML exports
- Updated UI for Markdown exports
