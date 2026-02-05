# @yoopta/callout

Callout plugin for Yoopta Editor. Renders callout blocks with optional theme (default, success, warning, error, info). Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/callout
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Callout from '@yoopta/callout';

const plugins = [Callout];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import Callout from '@yoopta/callout';
import { CalloutUI } from '@yoopta/themes-shadcn/callout';

const CalloutWithUI = Callout.extend({ elements: CalloutUI });
const plugins = [CalloutWithUI];
```

## Default options

- **display:** title `'Callout'`, description `'Make writing stand out'`
- **shortcuts:** `['<']`

## Extend

```tsx
Callout.extend({
  elements: {
    callout: { render: (props) => <YourCallout {...props} /> },
  },
  options: {
    shortcuts: ['callout'],
    display: { title: 'Callout', description: 'Your description' },
    HTMLAttributes: { className: 'my-callout' },
  },
});
```

## Classnames

- `.yoopta-callout` — root
- `.yoopta-callout-theme-['default' | 'success' | 'warning' | 'error' | 'info']`

See [Callout plugin docs](https://docs.yoopta.dev/plugins/callout) and [Core themes](https://docs.yoopta.dev/core/themes).
