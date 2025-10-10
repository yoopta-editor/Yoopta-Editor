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
  hoveredBlockId: string | null;  // ID of currently hovered block
  isVisible: boolean;              // Panel visibility
  position: { top: number; left: number };  // Panel position
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

- `.yoopta-floating-block-actions` - container
- `.yoopta-floating-action-button` - button

### CSS Variables (shadcn style)

You can customize the appearance using CSS variables. The design system uses HSL color tokens for better theming:

#### Base Color Tokens

```css
:root {
  /* Base colors (HSL format without hsl()) */
  --yoopta-background: 0 0% 100%;
  --yoopta-foreground: 222.2 84% 4.9%;
  --yoopta-muted: 210 40% 96.1%;
  --yoopta-border: 214.3 31.8% 91.4%;
  --yoopta-accent: 210 40% 96.1%;
  --yoopta-ring: 222.2 84% 4.9%;
}

.dark {
  --yoopta-background: 222.2 84% 4.9%;
  --yoopta-foreground: 210 40% 98%;
  --yoopta-muted: 217.2 32.6% 17.5%;
  --yoopta-border: 217.2 32.6% 17.5%;
  --yoopta-accent: 217.2 32.6% 17.5%;
  --yoopta-ring: 212.7 26.8% 83.9%;
}
```

#### Component Variables

```css
:root {
  /* Container */
  --yoopta-floating-bg: var(--yoopta-background);
  --yoopta-floating-border: var(--yoopta-border);
  --yoopta-floating-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --yoopta-floating-z-index: 100;
  --yoopta-floating-gap: 1px;
  --yoopta-floating-padding: 4px;
  --yoopta-floating-radius: 0.5rem;

  /* Button */
  --yoopta-floating-button-size: 28px;
  --yoopta-floating-button-color: var(--yoopta-foreground);
  --yoopta-floating-button-hover: var(--yoopta-accent);
  --yoopta-floating-button-radius: 0.375rem;

  /* Icon */
  --yoopta-floating-icon-size: 1rem;

  /* Focus ring */
  --yoopta-floating-ring-offset: 2px;
}
```

### Customization Examples

#### Custom Theme Colors

```css
:root {
  /* Custom blue accent */
  --yoopta-accent: 221.2 83.2% 53.3%;
  --yoopta-ring: 221.2 83.2% 53.3%;
}
```

#### Larger Buttons

```css
:root {
  --yoopta-floating-button-size: 32px;
  --yoopta-floating-padding: 6px;
  --yoopta-floating-gap: 2px;
  --yoopta-floating-radius: 0.75rem;
}
```

#### Custom Dark Theme

```css
.dark,
[data-theme='dark'] {
  --yoopta-background: 240 10% 3.9%;
  --yoopta-foreground: 0 0% 98%;
  --yoopta-accent: 240 4.8% 95.9%;
  --yoopta-border: 240 3.7% 15.9%;
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
