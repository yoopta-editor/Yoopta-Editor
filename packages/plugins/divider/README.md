# Divider

## Overview

## Installation

```bash
yarn add @yoopta/divider
```

## Elements

### divider

- props
- `color: string`
- `theme: 'solid' | 'dashed' | 'dotted' | 'gradient'`

## Commands

```javascript
export type DividerCommands = {
  buildDividerElements: (
    editor: YooEditor,
    options?: Partial<DividerElementProps>,
  ) => DividerElement,
  insertDivider: (editor: YooEditor, options?: Partial<DividerInsertOptions>) => void,
  deleteDivider: (editor: YooEditor, blockId: string) => void,
  updateDivider: (editor: YooEditor, blockId: string, props: Partial<DividerElementProps>) => void,
};
```

### buildDividerElements

` buildDividerElements: (editor: YooEditor, options?: Partial``) => DividerElement; `

Define elements structure for slate value in your block

### insertDivider

` editor.methods.insertDivider(blockId: string, options?: Partial``) => void `

Insert divider block in specific path with options

Options:

- `color: string`
- `theme: 'solid' | 'dashed' | 'dotted' | 'gradient'`

### deleteDivider

`deleteDivider: (editor: YooEditor, blockId: string) => void;`

Delete divider block

### updateDivider

` updateDivider: (editor: YooEditor, blockId: string, props: Partial``) => void; `

Update divider props

Options:

- `color: string`
- `theme: 'solid' | 'dashed' | 'dotted' | 'gradient'`

## Hotkeys

| Operation                           | Hotkey          |
| ----------------------------------- | --------------- |
| Switch themes when block is focused | **cmd+shift+d** |

## Styling

| Classname              | Element                             |
| ---------------------- | ----------------------------------- |
| yoopta-divider         | Root of divider                     |
| yoopta-divider-[theme] | Divider element with specific theme |
