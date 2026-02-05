# @yoopta/carousel

Carousel block plugin for Yoopta Editor. Renders a carousel of items (e.g. images or cards). Use headless or with theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/carousel
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Carousel from '@yoopta/carousel';

const plugins = [Carousel];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Carousel, /* ... */]);
```

Or: `Carousel.extend({ elements: CarouselUI })` with `CarouselUI` from `@yoopta/themes-shadcn/carousel`.

## Extend

```tsx
Carousel.extend({
  elements: {
    'carousel-container': { render: (props) => <YourCarousel {...props} /> },
  },
  options: {
    display: { title: 'Carousel', description: 'Your description' },
  },
});
```

See [Carousel plugin docs](https://docs.yoopta.dev/plugins/carousel).
