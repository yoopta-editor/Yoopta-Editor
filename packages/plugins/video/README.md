# @yoopta/video

Video block plugin for Yoopta Editor. Renders video blocks (embed or file) with optional caption and settings. Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/video
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Video from '@yoopta/video';

const plugins = [Video];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Video, /* ... */]);
```

Or: `Video.extend({ elements: VideoUI })` with `VideoUI` from `@yoopta/themes-shadcn/video`.

## Plugin options

Options may include `onError` or custom handlers. See the package types and [Video plugin docs](https://docs.yoopta.dev/plugins/video).

## Extend

```tsx
Video.extend({
  elements: {
    video: { render: (props) => <YourVideoBlock {...props} /> },
  },
  options: {
    display: { title: 'Video', description: 'Add a video' },
  },
});
```

See [Video plugin docs](https://docs.yoopta.dev/plugins/video).
