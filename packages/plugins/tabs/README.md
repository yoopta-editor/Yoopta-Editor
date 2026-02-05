# @yoopta/tabs

Tabs block plugin for Yoopta Editor. Renders tabbed content with multiple panels. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/tabs
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Tabs from '@yoopta/tabs';

const plugins = [Tabs];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Tabs, /* ... */]);
```

Or: `Tabs.extend({ elements: TabsUI })` with `TabsUI` from `@yoopta/themes-shadcn/tabs`.

## Default options

- **display:** title `'Tabs'`, description for tabbed content
- **shortcuts:** e.g. `['tabs']`

## Extend

```tsx
Tabs.extend({
  elements: {
    tabs: { render: (props) => <YourTabs {...props} /> },
  },
  options: {
    display: { title: 'Tabs', description: 'Your description' },
  },
});
```

## Classnames

- `.yoopta-tabs` — root
- `.yoopta-tabs-theme-['default' | 'success' | 'warning' | 'error' | 'info']` (if used by theme)

See [Tabs plugin docs](https://docs.yoopta.dev/plugins/tabs).
