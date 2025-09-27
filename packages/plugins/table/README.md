# Table

## Overview

The Table Plugin is a powerful extension for Yoopta-Editor, designed to bring seamless table creation and editing capabilities into your workflow

## Installation

```bash
yarn add @yoopta/table
```

## Elements

### table

- props
- `headerRow`
- `headerColumn`
- children elements
- `table-row`

### table-row

- props
- children elements
- `table-data-cell`

### table-data-cell

- props
- `asHeader`
- `width`

## Commands

```javascript
export type TableCommands = {
  buildTableElements: (editor: YooEditor, options?: InsertOptions) => TableElement,
  insertTable: (editor: YooEditor, options?: InsertOptions) => void,
  deleteTable: (editor: YooEditor, blockId: string) => void,
  insertTableRow: (editor: YooEditor, blockId: string, options?: Options) => void,
  deleteTableRow: (editor: YooEditor, blockId: string, options?: DeleteOptions) => void,
  moveTableRow: (editor: YooEditor, blockId: string, options: MoveTableOptions) => void,
  moveTableColumn: (editor: YooEditor, blockId: string, options: MoveTableOptions) => void,
  insertTableColumn: (editor: YooEditor, blockId: string, options?: Options) => void,
  deleteTableColumn: (editor: YooEditor, blockId: string, options?: DeleteOptions) => void,
  updateColumnWidth: (
    editor: YooEditor,
    blockId: string,
    columnIndex: number,
    width: number,
  ) => void,
  toggleHeaderRow: (editor: YooEditor, blockId: string) => void,
  toggleHeaderColumn: (editor: YooEditor, blockId: string) => void,
};
```

### buildTableElements

`buildTableElements: (editor: YooEditor, options?: InsertOptions) => TableElement;`

Define elements structure for slate value in your block

### insertTable

`editor.methods.insertTable(blockId: string, options?: InsertOptions) => void`

Insert table block in specific path with options

Options:

- `rows: number`
- `columns: number`
- `columnWidth?: number`
- `headerColumn?: boolean`
- `headerRow?: boolean`

### deleteTable

`deleteTable: (editor: YooEditor, blockId: string) => void;`

Delete table block

### insertTableRow

`insertTableRow: (editor: YooEditor, blockId: string, options?: Options) => void;`

Insert table row in specific location

Options:

- `path?: Location & Span`
- `select?: boolean`
- `insertMode?: 'before' | 'after';`

## Hotkeys

| Operation                      | Hotkey               |
| ------------------------------ | -------------------- |
| Insert row after               | **shift+enter**      |
| Insert row before              | **cmd+shift+enter**  |
| Delete row                     | **cmd+shift+delete** |
| Insert column to right         | **cmd+shift+→**      |
| Insert column to left          | **cmd+shift+←**      |
| Delete column                  | **cmd+alt+delete**   |
| Toggle header for first row    | **cmd+shift+H**      |
| Toggle header for first column | **cmd+shift+V**      |
|                                | **cmd+a**            |

## Styling

| Classname                      | Element                       |
| ------------------------------ | ----------------------------- |
| yoopta-table-block             | Root of table                 |
| yoopta-table                   | Table element                 |
| yoopta-table-selecting         | When table is under selection |
| yoopta-table-data-cell         | Table data cell               |
| yoopta-table-data-cell-head    | Table data head cell          |
| yoopta-table-data-cell-content | Content of data cell          |
