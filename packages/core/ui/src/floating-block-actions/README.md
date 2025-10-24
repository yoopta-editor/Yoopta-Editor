# FloatingBlockActions

Floating action panel that appears when hovering over blocks.

## Usage

### Basic Example

```tsx
import { YooptaUI, FloatingBlockActions } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';

function Editor() {
  const editor = useYooptaEditor();

  return (
    <YooptaUI>
      <YooptaEditor editor={editor} plugins={plugins}>
        <FloatingBlockActions>
          <FloatingBlockActions.Button onClick={() => console.log('Plus')}>
            +
          </FloatingBlockActions.Button>
          <FloatingBlockActions.Button onClick={() => console.log('Drag')}>
            ⋮⋮
          </FloatingBlockActions.Button>
        </FloatingBlockActions>
      </YooptaEditor>
    </YooptaUI>
  );
}
```

### With Hook for Handlers

```tsx
import { FloatingBlockActions, useFloatingBlockActions } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';

function CustomFloatingActions() {
  const editor = useYooptaEditor();

  const { hoveredBlockId, onPlusClick, onDragClick } = useFloatingBlockActions({
    onPlusClick: (blockId, event) => {
      console.log('Plus clicked for block:', blockId);
      // Your logic here
    },
    onDragClick: (blockId, event) => {
      console.log('Drag clicked for block:', blockId);
      // Open BlockOptions or other actions
    },
  });

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onPlusClick}>+</FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick}>⋮⋮</FloatingBlockActions.Button>
      {hoveredBlockId && (
        <FloatingBlockActions.Button onClick={() => console.log('Custom')}>
          Custom
        </FloatingBlockActions.Button>
      )}
    </FloatingBlockActions>
  );
}
```

### With Icons

```tsx
import { PlusIcon } from 'lucide-react';
import { DragHandleDots1Icon } from '@radix-ui/react-icons';

function FloatingActionsWithIcons() {
  const { onPlusClick, onDragClick } = useFloatingBlockActions({
    onPlusClick: (blockId) => {
      // Logic for adding block
    },
    onDragClick: (blockId) => {
      // Logic for drag & drop or opening menu
    },
  });

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onPlusClick} title="Add block">
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} title="Drag to move">
        <DragHandleDots1Icon />
      </FloatingBlockActions.Button>
    </FloatingBlockActions>
  );
}
```

## API

### FloatingBlockActions

Compound component with subcomponents:

- `FloatingBlockActions.Root` - container (can use `FloatingBlockActions` directly)
- `FloatingBlockActions.Button` - action button

### useFloatingBlockActions(options?)

Hook for working with FloatingBlockActions.

**Returns:**

```tsx
{
  hoveredBlockId: string | null;  // ID of currently active block (hovered or frozen)
  isVisible: boolean;              // Panel visibility
  isFrozen: boolean;               // Whether panel is frozen (ignores mousemove)
  style: CSSProperties;            // Positioning styles
  blockActionsRef: React.RefObject;         // Ref for container
  onPlusClick: (event: React.MouseEvent) => void;
  onDragClick: (event: React.MouseEvent) => void;
}
```

**Options:**

```tsx
{
  onPlusClick?: (blockId: string, event: React.MouseEvent) => void;
  onDragClick?: (blockId: string, event: React.MouseEvent) => void;
}
```

## Styling

Components use CSS classes:

- `.yoopta-ui-floating-block-actions` - container
- `.yoopta-ui-floating-action-button` - button

### CSS Variables (shadcn style)

You can customize the appearance using CSS variables. The design system uses HSL color tokens for better theming:

#### Base Color Tokens

```css
:root {
  /* Base colors (HSL format without hsl()) */
  --yoopta-ui-background: 0 0% 100%;
  --yoopta-ui-foreground: 222.2 84% 4.9%;
  --yoopta-ui-muted: 210 40% 96.1%;
  --yoopta-ui-border: 214.3 31.8% 91.4%;
  --yoopta-ui-accent: 210 40% 96.1%;
  --yoopta-ui-ring: 222.2 84% 4.9%;
}

.dark {
  --yoopta-ui-background: 222.2 84% 4.9%;
  --yoopta-ui-foreground: 210 40% 98%;
  --yoopta-ui-muted: 217.2 32.6% 17.5%;
  --yoopta-ui-border: 217.2 32.6% 17.5%;
  --yoopta-ui-accent: 217.2 32.6% 17.5%;
  --yoopta-ui-ring: 212.7 26.8% 83.9%;
}
```

#### Component Variables

```css
:root {
  /* Container */
  --yoopta-ui-floating-bg: var(--yoopta-ui-background);
  --yoopta-ui-floating-border: var(--yoopta-ui-border);
  --yoopta-ui-floating-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --yoopta-ui-floating-z-index: 100;
  --yoopta-ui-floating-gap: 1px;
  --yoopta-ui-floating-padding: 4px;
  --yoopta-ui-floating-radius: 0.5rem;

  /* Button */
  --yoopta-ui-floating-button-min-width: 28px;
  --yoopta-ui-floating-button-min-height: 28px;
  --yoopta-ui-floating-button-padding-y: 6px;
  --yoopta-ui-floating-button-padding-x: 8px;
  --yoopta-ui-floating-button-color: var(--yoopta-ui-foreground);
  --yoopta-ui-floating-button-hover: var(--yoopta-ui-accent);
  --yoopta-ui-floating-button-radius: 0.375rem;

  /* Icon */
  --yoopta-ui-floating-icon-size: 1rem;

  /* Focus ring */
  --yoopta-ui-floating-ring-offset: 2px;
}
```

### Customization Examples

#### Custom Theme Colors

```css
:root {
  /* Custom blue accent */
  --yoopta-ui-accent: 221.2 83.2% 53.3%;
  --yoopta-ui-ring: 221.2 83.2% 53.3%;
}
```

#### Larger Buttons

```css
:root {
  --yoopta-ui-floating-button-min-width: 32px;
  --yoopta-ui-floating-button-min-height: 32px;
  --yoopta-ui-floating-button-padding-y: 8px;
  --yoopta-ui-floating-button-padding-x: 12px;
  --yoopta-ui-floating-padding: 6px;
  --yoopta-ui-floating-gap: 2px;
  --yoopta-ui-floating-radius: 0.75rem;
}
```

#### Custom Dark Theme

```css
.dark,
[data-theme='dark'] {
  --yoopta-ui-background: 240 10% 3.9%;
  --yoopta-ui-foreground: 0 0% 98%;
  --yoopta-ui-accent: 240 4.8% 95.9%;
  --yoopta-ui-border: 240 3.7% 15.9%;
}
```

Use `data-theme="dark"` attribute:

```tsx
<div data-theme="dark">
  <YooptaUI>
    <YooptaEditor {...props}>
      <FloatingBlockActions />
    </YooptaEditor>
  </YooptaUI>
</div>
```

You can also override via className:

```tsx
<FloatingBlockActions className="my-custom-class">
  <FloatingBlockActions.Button className="my-button">Action</FloatingBlockActions.Button>
</FloatingBlockActions>
```

## Automatic Tracking

The hook automatically tracks:

- Mouse hover on blocks with `[data-yoopta-block]` attribute
- Scroll (hides panel)
- Click outside panel

Position is automatically calculated based on block position.

## Freeze Behavior

FloatingBlockActions can be "frozen" to prevent it from moving when other UI components are open:

- When `BlockOptions` opens, FloatingBlockActions **freezes** on the current block
- While frozen, mousemove events are **ignored**
- When BlockOptions closes, FloatingBlockActions **unfreezes** and resumes normal tracking

This ensures a smooth UX when interacting with menus - the action buttons stay visible and accessible.

```tsx
const { isFrozen } = useFloatingBlockActions();

// isFrozen === true when BlockOptions (or other menus) are open
```
