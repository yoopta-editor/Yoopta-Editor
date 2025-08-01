# BlockOptions

A beautiful, modern dropdown menu component for block actions, designed in the style of shadcn/ui with smooth animations and precise positioning.

## Features

- ✨ Modern design with smooth animations
- 🎨 Support for light and dark themes
- 🔧 Customizable variants and sizes
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎯 Precise positioning with floating UI
- 🎭 Context-based state management

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { BlockOptions } from '@yoopta/ui';
import { TrashIcon, CopyIcon, Link2Icon } from 'lucide-react';

const MyBlockOptions = () => {
  return (
    <BlockOptions.Root>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<CopyIcon />} size="md">
            Duplicate block
          </BlockOptions.Button>
          <BlockOptions.Button icon={<Link2Icon />} size="md">
            Copy link to block
          </BlockOptions.Button>
          <BlockOptions.Separator />
          <BlockOptions.Button icon={<TrashIcon />} variant="destructive" size="md">
            Delete block
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions.Root>
  );
};
```

### With Context Provider

```tsx
import { BlockOptions, BlockOptionsProvider, useBlockOptions } from '@yoopta/ui';

const MyComponent = () => {
  const { isOpen, openMenu, closeMenu } = useBlockOptions();

  return (
    <BlockOptionsProvider>
      <BlockOptions.Root isOpen={isOpen} onClose={closeMenu}>
        <BlockOptions.Content>
          <BlockOptions.Group>
            <BlockOptions.Button icon={<EditIcon />} onClick={() => console.log('Edit block')}>
              Edit
            </BlockOptions.Button>
            <BlockOptions.Button icon={<EyeIcon />} onClick={() => console.log('Preview block')}>
              Preview
            </BlockOptions.Button>
          </BlockOptions.Group>
          <BlockOptions.Separator />
          <BlockOptions.Group>
            <BlockOptions.Button icon={<TrashIcon />} variant="destructive" onClick={() => console.log('Delete block')}>
              Delete
            </BlockOptions.Button>
          </BlockOptions.Group>
        </BlockOptions.Content>
      </BlockOptions.Root>
    </BlockOptionsProvider>
  );
};
```

### With Custom Handlers

```tsx
import { BlockOptions, useBlockOptionHandlers } from '@yoopta/ui';

const MyComponent = () => {
  const { handleDuplicate, handleDelete, handleCopyLink } = useBlockOptionHandlers({
    blockId: 'block-1',
    onDuplicate: (blockId) => console.log('Duplicate:', blockId),
    onDelete: (blockId) => console.log('Delete:', blockId),
    onCopyLink: (blockId) => console.log('Copy link:', blockId),
  });

  return (
    <BlockOptions.Root>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<CopyIcon />} onClick={handleDuplicate}>
            Duplicate
          </BlockOptions.Button>
          <BlockOptions.Button icon={<Link2Icon />} onClick={handleCopyLink}>
            Copy Link
          </BlockOptions.Button>
          <BlockOptions.Separator />
          <BlockOptions.Button icon={<TrashIcon />} variant="destructive" onClick={handleDelete}>
            Delete
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions.Root>
  );
};
```

## API

### BlockOptionsProvider

The provider component that manages block options state and context.

```tsx
<BlockOptionsProvider>{/* Block options components */}</BlockOptionsProvider>
```

### BlockOptions.Root

The main container component that handles positioning and portal rendering.

```tsx
<BlockOptions.Root
  isOpen?: boolean
  onClose?: () => void
  refs?: any
  style?: React.CSSProperties
  className?: string
>
  {/* Block options content */}
</BlockOptions.Root>
```

### BlockOptions.Content

The content wrapper with styling and backdrop blur.

```tsx
<BlockOptions.Content className?: string>
  {/* Menu items */}
</BlockOptions.Content>
```

### BlockOptions.Group

Groups related menu items together.

```tsx
<BlockOptions.Group className?: string>
  {/* Menu items */}
</BlockOptions.Group>
```

### BlockOptions.Button

A menu item button with icon and text support.

```tsx
<BlockOptions.Button
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
>
  Button text
</BlockOptions.Button>
```

### BlockOptions.Separator

A visual separator between menu groups.

```tsx
<BlockOptions.Separator className?: string />
```

## Hooks

### useBlockOptions

Provides block options state and handlers.

```tsx
const {
  isOpen,
  openMenu,
  closeMenu,
  toggleMenu
} = useBlockOptions({
  onOpen?: () => void,
  onClose?: () => void
});
```

### useBlockOptionHandlers

Provides common block option action handlers.

```tsx
const {
  handleDuplicate,
  handleDelete,
  handleCopyLink,
  handleEdit
} = useBlockOptionHandlers({
  blockId: string,
  onDuplicate?: (blockId: string) => void,
  onDelete?: (blockId: string) => void,
  onCopyLink?: (blockId: string) => void,
  onEdit?: (blockId: string) => void
});
```

### useBlockOptionsContext

Access the block options context directly.

```tsx
const { state, actions } = useBlockOptionsContext();
```

## Props

### BlockOptions.Root

| Prop        | Type                  | Default | Description              |
| ----------- | --------------------- | ------- | ------------------------ |
| `isOpen`    | `boolean`             | `false` | Whether the menu is open |
| `onClose`   | `() => void`          | -       | Close handler            |
| `refs`      | `any`                 | -       | Refs for positioning     |
| `style`     | `React.CSSProperties` | -       | Inline styles            |
| `className` | `string`              | -       | Additional CSS classes   |
| `children`  | `ReactNode`           | -       | Menu content             |

### BlockOptions.Button

| Prop        | Type                         | Default     | Description            |
| ----------- | ---------------------------- | ----------- | ---------------------- |
| `icon`      | `ReactNode`                  | -           | Button icon            |
| `variant`   | `'default' \| 'destructive'` | `'default'` | Button style variant   |
| `size`      | `'sm' \| 'md'`               | `'md'`      | Button size            |
| `className` | `string`                     | -           | Additional CSS classes |
| `onClick`   | `() => void`                 | -           | Click handler          |
| `children`  | `ReactNode`                  | -           | Button text            |

### useBlockOptions Options

| Prop      | Type         | Default | Description         |
| --------- | ------------ | ------- | ------------------- |
| `onOpen`  | `() => void` | -       | Menu open callback  |
| `onClose` | `() => void` | -       | Menu close callback |

### useBlockOptionHandlers Options

| Prop          | Type                        | Default | Description               |
| ------------- | --------------------------- | ------- | ------------------------- |
| `blockId`     | `string`                    | -       | Block identifier          |
| `onDuplicate` | `(blockId: string) => void` | -       | Duplicate action callback |
| `onDelete`    | `(blockId: string) => void` | -       | Delete action callback    |
| `onCopyLink`  | `(blockId: string) => void` | -       | Copy link action callback |
| `onEdit`      | `(blockId: string) => void` | -       | Edit action callback      |

## Design Features

- **Modern Aesthetics**: Clean, minimal design with subtle shadows and rounded corners
- **Smooth Animations**: Elegant fade-in and hover effects using CSS transitions
- **Color System**: HSL-based color palette with proper contrast ratios
- **Dark Mode**: Automatic dark theme support with `prefers-color-scheme`
- **Accessibility**: Proper focus states, keyboard navigation, and ARIA attributes
- **Responsive**: Adapts to different screen sizes and content lengths

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  /* Light theme */
  --yoopta-ui-block-options-bg: hsl(0 0% 100%);
  --yoopta-ui-block-options-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-block-options-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-block-options-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-block-options-hover-bg: hsl(210 40% 98%);
  --yoopta-ui-block-options-destructive-text: hsl(0 84.2% 60.2%);
  --yoopta-ui-block-options-separator: hsl(214.3 31.8% 91.4%);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme overrides */
    --yoopta-ui-block-options-bg: hsl(222.2 84% 4.9%);
    --yoopta-ui-block-options-text: hsl(210 40% 98%);
    --yoopta-ui-block-options-hover-bg: hsl(217.2 32.6% 17.5%);
    --yoopta-ui-block-options-destructive-text: hsl(0 84.2% 60.2%);
  }
}
```

## Examples

### Basic Menu

```tsx
<BlockOptions.Root>
  <BlockOptions.Content>
    <BlockOptions.Group>
      <BlockOptions.Button icon={<EditIcon />}>Edit</BlockOptions.Button>
      <BlockOptions.Button icon={<CopyIcon />}>Copy</BlockOptions.Button>
      <BlockOptions.Separator />
      <BlockOptions.Button icon={<TrashIcon />} variant="destructive">
        Delete
      </BlockOptions.Button>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>
```

### Multiple Groups

```tsx
<BlockOptions.Root>
  <BlockOptions.Content>
    <BlockOptions.Group>
      <BlockOptions.Button icon={<EditIcon />}>Edit</BlockOptions.Button>
      <BlockOptions.Button icon={<EyeIcon />}>Preview</BlockOptions.Button>
    </BlockOptions.Group>
    <BlockOptions.Separator />
    <BlockOptions.Group>
      <BlockOptions.Button icon={<CopyIcon />}>Duplicate</BlockOptions.Button>
      <BlockOptions.Button icon={<Link2Icon />}>Share</BlockOptions.Button>
    </BlockOptions.Group>
    <BlockOptions.Separator />
    <BlockOptions.Group>
      <BlockOptions.Button icon={<TrashIcon />} variant="destructive">
        Delete
      </BlockOptions.Button>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>
```

### Small Size Variant

```tsx
<BlockOptions.Button icon={<EditIcon />} size="sm">
  Quick Edit
</BlockOptions.Button>
```

### With Custom Styling

```tsx
<BlockOptions.Root className="my-custom-menu">
  <BlockOptions.Content className="my-custom-content">
    <BlockOptions.Group className="my-custom-group">
      <BlockOptions.Button
        icon={<EditIcon />}
        className="my-custom-button"
        onClick={() => console.log('Custom action')}
      >
        Custom Action
      </BlockOptions.Button>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>
```

### Destructive Actions

```tsx
<BlockOptions.Button
  icon={<TrashIcon />}
  variant="destructive"
  onClick={() => {
    if (confirm('Are you sure you want to delete this block?')) {
      handleDelete();
    }
  }}
>
  Delete Block
</BlockOptions.Button>
```
