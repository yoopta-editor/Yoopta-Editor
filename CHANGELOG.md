# Changelog

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
