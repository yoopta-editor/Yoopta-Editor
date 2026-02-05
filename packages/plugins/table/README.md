# @yoopta/table

Table block plugin for Yoopta Editor. Renders tables with rows and cells; supports header row/column, resize, and row/column operations. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/table
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Table from '@yoopta/table';

const plugins = [Table];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Elements

- **table** — props: `headerRow`, `headerColumn`; children: `table-row`
- **table-row** — children: `table-data-cell`
- **table-data-cell** — props: `asHeader`, `width`

## Commands

Use the plugin's commands via the editor (e.g. from block options or programmatically):

- **insertTable** — Insert table with options
- **deleteTable** — Delete table by `blockId`
- **insertTableRow** / **deleteTableRow** / **moveTableRow**
- **insertTableColumn** / **deleteTableColumn** / **moveTableColumn**
- **updateColumnWidth**
- **buildTableElements** — Build element structure for Slate value

See the package types and [Table plugin docs](https://docs.yoopta.dev/plugins/table) for full API.
