# @yoopta/steps

Steps block plugin for Yoopta Editor. Renders step-by-step content with ordered steps. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/steps
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Steps from '@yoopta/steps';

const plugins = [Steps];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Steps, /* ... */]);
```

Or: `Steps.extend({ elements: StepsUI })` with `StepsUI` from `@yoopta/themes-shadcn/steps`.

## Extend

```tsx
Steps.extend({
  elements: {
    'steps-container': { render: (props) => <YourSteps {...props} /> },
  },
  options: {
    display: { title: 'Steps', description: 'Step-by-step content' },
  },
});
```

See [Steps plugin docs](https://docs.yoopta.dev/plugins/steps).
