# BlockOptions

Context menu for block actions (duplicate, delete, copy link, etc.).

## Usage

### Basic Example

```tsx
import { YooptaUI, BlockOptions, useBlockOptions } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';

function BlockOptionsComponent() {
  const { isOpen, close, duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();

  if (!isOpen) return null;

  return (
    <BlockOptions>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button onClick={duplicateBlock}>Duplicate</BlockOptions.Button>
          <BlockOptions.Button onClick={copyBlockLink}>Copy link to block</BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button onClick={deleteBlock} variant="destructive">
            Delete
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions>
  );
}
```

### With Icons

```tsx
import { TrashIcon, CopyIcon, Link2Icon } from 'lucide-react';

function BlockOptionsWithIcons() {
  const { isOpen, duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();

  if (!isOpen) return null;

  return (
    <BlockOptions>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<CopyIcon />} onClick={duplicateBlock}>
            Duplicate
          </BlockOptions.Button>
          <BlockOptions.Button icon={<Link2Icon />} onClick={copyBlockLink}>
            Copy link to block
          </BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button icon={<TrashIcon />} onClick={deleteBlock} variant="destructive">
            Delete
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions>
  );
}
```

### Opening from FloatingBlockActions

```tsx
import { FloatingBlockActions, useFloatingBlockActions, useBlockOptions } from '@yoopta/ui';

function FloatingActions() {
  const { open } = useBlockOptions();

  const onDragClick = (e: React.MouseEvent) => {
    open({
      reference: e.currentTarget as HTMLElement,
    });
  };

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onDragClick}>⋮⋮</FloatingBlockActions.Button>
    </FloatingBlockActions>
  );
}
```

### Integration with ActionMenuList (Turn Into)

```tsx
import { BlockOptions, useBlockOptions, useActionMenuList } from '@yoopta/ui';

function BlockOptionsComponent() {
  const { reference, close, duplicateBlock, deleteBlock } = useBlockOptions();
  const { open: openActionMenuList } = useActionMenuList();

  const onTurnInto = () => {
    if (!reference) return;
    // Open ActionMenuList with small view at BlockOptions position
    openActionMenuList({ reference, view: 'small' });
    close();
  };

  return (
    <BlockOptions.Root>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button onClick={onTurnInto}>Turn into</BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button onClick={() => duplicateBlock(blockId)}>
            Duplicate
          </BlockOptions.Button>
          <BlockOptions.Button onClick={() => deleteBlock(blockId)} variant="destructive">
            Delete
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions.Root>
  );
}
```

## API

### BlockOptions Components

Compound component with subcomponents:

- `BlockOptions.Root` - container (can use `BlockOptions` directly)
- `BlockOptions.Content` - content wrapper
- `BlockOptions.Group` - group of related options
- `BlockOptions.Button` - action button
- `BlockOptions.Separator` - visual separator

### useBlockOptions()

Hook for managing BlockOptions state and actions.

**Returns:**

```tsx
{
  isOpen: boolean;                      // Menu visibility
  isMounted: boolean;                   // Transition state
  blockId: string | null;               // Current block ID
  reference: HTMLElement | null;        // Reference element for positioning
  style: CSSProperties;                 // Positioning styles
  setFloatingRef: (node: HTMLElement | null) => void; // Set floating element ref

  // Actions
  open: (options: { reference: HTMLElement; blockId?: string }) => void;
  close: () => void;
  duplicateBlock: (blockId: string) => void;
  copyBlockLink: (blockId: string) => void;
  deleteBlock: (blockId: string) => void;
}
```

## Component Props

### BlockOptions.Button

```tsx
type BlockOptionsButtonProps = {
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode; // Icon element
  variant?: 'default' | 'destructive'; // Style variant
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

## Styling

Components use CSS classes:

- `.yoopta-ui-block-options` - container
- `.yoopta-ui-block-options-content` - content wrapper
- `.yoopta-ui-block-options-group` - group container
- `.yoopta-ui-block-options-button` - button
- `.yoopta-ui-block-options-button-default` - default variant
- `.yoopta-ui-block-options-button-destructive` - destructive variant
- `.yoopta-ui-block-options-separator` - separator

### CSS Variables (shadcn style)

#### Base Color Tokens

```css
:root {
  /* Container */
  --yoopta-ui-block-options-bg: var(--yoopta-ui-background);
  --yoopta-ui-block-options-border: var(--yoopta-ui-border);
  --yoopta-ui-block-options-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-block-options-radius: 0.5rem;
  --yoopta-ui-block-options-padding: 4px;
  --yoopta-ui-block-options-min-width: 220px;
  --yoopta-ui-block-options-z-index: 200;

  /* Button */
  --yoopta-ui-block-options-button-padding-y: 8px;
  --yoopta-ui-block-options-button-padding-x: 12px;
  --yoopta-ui-block-options-button-font-size: 0.875rem;
  --yoopta-ui-block-options-button-color: var(--yoopta-ui-foreground);
  --yoopta-ui-block-options-button-hover: var(--yoopta-ui-accent);

  /* Destructive */
  --yoopta-ui-destructive: 0 84.2% 60.2%;
  --yoopta-ui-block-options-button-destructive-color: hsl(var(--yoopta-ui-destructive));

  /* Icon */
  --yoopta-ui-block-options-icon-size: 1rem;
  --yoopta-ui-block-options-icon-gap: 8px;

  /* Separator */
  --yoopta-ui-block-options-separator-height: 1px;
  --yoopta-ui-block-options-separator-margin: 4px 0;
}
```

### Customization Examples

#### Wider Menu

```css
:root {
  --yoopta-ui-block-options-min-width: 280px;
  --yoopta-ui-block-options-padding: 8px;
}
```

#### Larger Buttons

```css
:root {
  --yoopta-ui-block-options-button-padding-y: 10px;
  --yoopta-ui-block-options-button-padding-x: 16px;
  --yoopta-ui-block-options-button-font-size: 1rem;
}
```

#### Custom Destructive Color

```css
:root {
  --yoopta-ui-destructive: 0 72% 51%; /* Custom red */
}
```

### Dark Theme

Use `data-theme="dark"` attribute:

```tsx
<div data-theme="dark">
  <YooptaUI>
    <YooptaEditor {...props}>
      <BlockOptionsComponent />
    </YooptaEditor>
  </YooptaUI>
</div>
```

## Features

- **Floating UI** - Smart positioning with flip and shift
- **Keyboard Navigation** - Full keyboard support (Escape to close)
- **Click Outside** - Automatically closes when clicking outside
- **Variants** - Default and destructive button styles
- **Icons** - Optional icon support for buttons
- **Animations** - Smooth fade-in animation
- **Dark Theme** - Built-in dark mode support
- **Accessibility** - ARIA attributes and focus management
- **Freeze Integration** - Freezes FloatingBlockActions while menu is open

## Integration with Editor

The hook automatically integrates with `@yoopta/editor`:

- `duplicateBlock()` - Uses `editor.duplicateBlock()`
- `deleteBlock()` - Uses `editor.deleteBlock()`
- `copyBlockLink()` - Copies block link to clipboard and emits `block:copy` event

## Notes

- Menu automatically positions itself using Floating UI
- Menu closes after any action
- Closes on Escape key or click outside
- Requires `YooptaUI` provider wrapper
- Works with `FloatingBlockActions` for seamless UX
- **Automatically freezes FloatingBlockActions** when menu opens - this prevents FloatingBlockActions from moving while you interact with the menu
