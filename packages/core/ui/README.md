# @yoopta/ui

UI components for Yoopta Editor.

## Installation

```bash
npm install @yoopta/ui
# or
yarn add @yoopta/ui
```

## Quick Start

```tsx
import { YooptaUI, FloatingBlockActions, useFloatingBlockActions } from '@yoopta/ui';
import YooptaEditor from '@yoopta/editor';

function Editor() {
  const editor = createYooptaEditor();

  return (
    <YooptaUI>
      <YooptaEditor editor={editor} plugins={plugins}>
        <FloatingBlockActions>
          <FloatingBlockActions.Button onClick={() => {}}>+</FloatingBlockActions.Button>
          <FloatingBlockActions.Button onClick={() => {}}>⋮⋮</FloatingBlockActions.Button>
        </FloatingBlockActions>
      </YooptaEditor>
    </YooptaUI>
  );
}
```

## Components

### YooptaUI

Provider component for UI state. Wraps the editor and provides context.

```tsx
<YooptaUI>
  <YooptaEditor {...props}>{/* UI components */}</YooptaEditor>
</YooptaUI>
```

### FloatingBlockActions

Floating action panel that appears on block hover.

```tsx
import { FloatingBlockActions, useFloatingBlockActions } from '@yoopta/ui';

function CustomFloatingActions() {
  const { onPlusClick, onDragClick } = useFloatingBlockActions({
    onPlusClick: (blockId, event) => {
      // Your logic
    },
    onDragClick: (blockId, event) => {
      // Your logic
    },
  });

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onPlusClick}>+</FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick}>⋮⋮</FloatingBlockActions.Button>
    </FloatingBlockActions>
  );
}
```

See [FloatingBlockActions README](./src/floating-block-actions/README.md) for details.

## Theming

Components use CSS variables for easy customization:

```css
:root {
  --yoopta-floating-bg: #ffffff;
  --yoopta-floating-border: #e5e7eb;
  --yoopta-floating-button-color: #6b7280;
  /* ... and more */
}
```

### Dark Theme

```tsx
<div data-theme="dark">
  <YooptaUI>
    <YooptaEditor {...props}>
      <FloatingBlockActions />
    </YooptaEditor>
  </YooptaUI>
</div>
```

Or use CSS:

```css
[data-theme='dark'] {
  --yoopta-floating-bg: #1f2937;
  --yoopta-floating-border: #374151;
  --yoopta-floating-button-color: #9ca3af;
}
```

## Architecture

Package built on compositional pattern:

```
YooptaUI (Provider)
├── FloatingBlockActions
│   ├── Root
│   └── Button
├── BlockOptions (coming soon)
│   ├── Root
│   ├── Content
│   ├── Group
│   └── Button
└── ActionMenu (coming soon)
    ├── Root
    ├── Content
    └── Item
```

Each component:

- Has corresponding hook (`useFloatingBlockActions`, `useBlockOptions`, etc.)
- Can be customized via props
- Works with other components through shared context

## Roadmap

- [x] FloatingBlockActions
- [ ] BlockOptions
- [ ] ActionMenu
- [ ] DnD integration
- [ ] Theming presets

## License

MIT
