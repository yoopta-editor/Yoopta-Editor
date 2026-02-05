# @yoopta/divider

Divider block plugin for Yoopta Editor. Renders horizontal dividers with configurable style (solid, dashed, dotted, gradient) and color. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/divider
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Divider from '@yoopta/divider';

const plugins = [Divider];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Elements

**divider** — props: `color` (string), `theme` (`'solid' | 'dashed' | 'dotted' | 'gradient'`).

## Commands

Use the plugin's commands via the editor (e.g. from block options or programmatically):

- **insertDivider** — Insert a divider block with optional `color` and `theme`.
- **deleteDivider** — Delete divider block by `blockId`.
- **updateDivider** — Update divider props (`color`, `theme`) by `blockId`.
- **buildDividerElements** — Build element structure for Slate value.

## Hotkeys

| Action                         | Hotkey           |
| ------------------------------ | ---------------- |
| Switch theme when block focused | **Cmd+Shift+D** |

## Styling

- `.yoopta-divider` — root
- `.yoopta-divider-[theme]` — divider with specific theme

See [Divider plugin docs](https://docs.yoopta.dev/plugins/divider).
