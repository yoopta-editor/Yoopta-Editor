# ActionMenu

A modern, accessible action menu component for Yoopta Editor, designed in the style of shadcn/ui with floating positioning and smooth animations.

## Features

- ✨ Floating positioning with smooth animations
- 🎨 Modern design with hover effects
- 🔧 Automatic selection detection
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
import { ActionMenu, ActionMenuProvider, useActionMenu } from '@yoopta/ui';
import { BoldIcon, ItalicIcon, AlignLeftIcon } from 'lucide-react';

const MyActionMenu = () => {
  const { isOpen, selectedText, position, openMenu, closeMenu } = useActionMenu();

  return (
    <ActionMenuProvider>
      <ActionMenu.Root isOpen={isOpen} onClose={closeMenu} position={position}>
        <ActionMenu.Content>
          <ActionMenu.Group>
            <ActionMenu.Item icon={<BoldIcon />} onClick={() => console.log('Bold clicked')}>
              Bold
            </ActionMenu.Item>
            <ActionMenu.Item icon={<ItalicIcon />} onClick={() => console.log('Italic clicked')}>
              Italic
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Separator />
          <ActionMenu.Group>
            <ActionMenu.Item icon={<AlignLeftIcon />} onClick={() => console.log('Align left clicked')}>
              Align Left
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu.Root>
    </ActionMenuProvider>
  );
};
```

### With Custom Handlers

```tsx
import { ActionMenu, useActionMenu } from '@yoopta/ui';

const MyComponent = () => {
  const { isOpen, selectedText, position, openMenu, closeMenu } = useActionMenu({
    onAction: (action) => {
      console.log('Action performed:', action);
    },
    onSelectionChange: (text) => {
      console.log('Selected text:', text);
    },
  });

  return (
    <ActionMenu.Root isOpen={isOpen} onClose={closeMenu} position={position}>
      <ActionMenu.Content>
        <ActionMenu.Item icon={<BoldIcon />} action="bold" onClick={() => console.log('Bold action')}>
          Bold
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu.Root>
  );
};
```

## API

### ActionMenuProvider

The provider component that manages action menu state and context.

```tsx
<ActionMenuProvider>{/* Action menu components */}</ActionMenuProvider>
```

### ActionMenu.Root

The main container component that handles positioning and portal rendering.

```tsx
<ActionMenu.Root
  isOpen?: boolean
  onClose?: () => void
  position?: { x: number; y: number }
  className?: string
>
  {/* Action menu content */}
</ActionMenu.Root>
```

### ActionMenu.Content

The content wrapper with styling and backdrop blur.

```tsx
<ActionMenu.Content className?: string>
  {/* Action menu groups */}
</ActionMenu.Content>
```

### ActionMenu.Group

Groups related action menu items together.

```tsx
<ActionMenu.Group className?: string>
  {/* Action menu items */}
</ActionMenu.Group>
```

### ActionMenu.Item

A menu item with icon and text support.

```tsx
<ActionMenu.Item
  icon?: React.ReactNode
  action?: string
  variant?: 'default' | 'destructive'
  disabled?: boolean
  onClick?: () => void
  className?: string
>
  Item text
</ActionMenu.Item>
```

### ActionMenu.Separator

A visual separator between action menu groups.

```tsx
<ActionMenu.Separator className?: string />
```

## Hooks

### useActionMenu

Provides action menu state and handlers.

```tsx
const {
  isOpen,
  selectedText,
  position,
  openMenu,
  closeMenu,
  handleSelectionChange,
  handleAction
} = useActionMenu({
  onAction?: (action: string) => void,
  onSelectionChange?: (text: string) => void,
  onOpen?: () => void,
  onClose?: () => void
});
```

### useActionMenuContext

Access the action menu context directly.

```tsx
const { state, actions } = useActionMenuContext();
```

## Props

### ActionMenu.Root

| Prop        | Type                       | Default | Description              |
| ----------- | -------------------------- | ------- | ------------------------ |
| `isOpen`    | `boolean`                  | `false` | Whether the menu is open |
| `onClose`   | `() => void`               | -       | Close handler            |
| `position`  | `{ x: number; y: number }` | -       | Menu position            |
| `className` | `string`                   | -       | Additional CSS classes   |
| `children`  | `ReactNode`                | -       | Menu content             |

### ActionMenu.Item

| Prop        | Type                         | Default     | Description              |
| ----------- | ---------------------------- | ----------- | ------------------------ |
| `icon`      | `ReactNode`                  | -           | Item icon                |
| `action`    | `string`                     | -           | Action identifier        |
| `variant`   | `'default' \| 'destructive'` | `'default'` | Item style variant       |
| `disabled`  | `boolean`                    | `false`     | Whether item is disabled |
| `onClick`   | `() => void`                 | -           | Click handler            |
| `className` | `string`                     | -           | Additional CSS classes   |
| `children`  | `ReactNode`                  | -           | Item text                |

### useActionMenu Options

| Prop                | Type                       | Default | Description               |
| ------------------- | -------------------------- | ------- | ------------------------- |
| `onAction`          | `(action: string) => void` | -       | Action performed callback |
| `onSelectionChange` | `(text: string) => void`   | -       | Selection change callback |
| `onOpen`            | `() => void`               | -       | Menu open callback        |
| `onClose`           | `() => void`               | -       | Menu close callback       |

## Design Features

- **Floating Positioning**: Automatically positions near selected text
- **Smooth Animations**: Elegant fade-in and hover effects
- **Selection Detection**: Automatically shows/hides based on text selection
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Context Management**: Centralized state management with React Context

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --yoopta-ui-action-menu-bg: hsl(0 0% 100%);
  --yoopta-ui-action-menu-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-action-menu-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-action-menu-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-action-menu-hover-bg: hsl(210 40% 98%);
  --yoopta-ui-action-menu-separator: hsl(214.3 31.8% 91.4%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-action-menu-bg: hsl(222.2 84% 4.9%);
    --yoopta-ui-action-menu-text: hsl(210 40% 98%);
    --yoopta-ui-action-menu-hover-bg: hsl(217.2 32.6% 17.5%);
  }
}
```

## Examples

### Basic Menu with Icons

```tsx
<ActionMenu.Root isOpen={isOpen} onClose={closeMenu} position={position}>
  <ActionMenu.Content>
    <ActionMenu.Group>
      <ActionMenu.Item icon={<BoldIcon />} action="bold">
        Bold
      </ActionMenu.Item>
      <ActionMenu.Item icon={<ItalicIcon />} action="italic">
        Italic
      </ActionMenu.Item>
      <ActionMenu.Item icon={<UnderlineIcon />} action="underline">
        Underline
      </ActionMenu.Item>
    </ActionMenu.Group>
  </ActionMenu.Content>
</ActionMenu.Root>
```

### Menu with Multiple Groups

```tsx
<ActionMenu.Root isOpen={isOpen} onClose={closeMenu} position={position}>
  <ActionMenu.Content>
    <ActionMenu.Group>
      <ActionMenu.Item icon={<CopyIcon />} action="copy">
        Copy
      </ActionMenu.Item>
      <ActionMenu.Item icon={<CutIcon />} action="cut">
        Cut
      </ActionMenu.Item>
    </ActionMenu.Group>
    <ActionMenu.Separator />
    <ActionMenu.Group>
      <ActionMenu.Item icon={<TrashIcon />} action="delete" variant="destructive">
        Delete
      </ActionMenu.Item>
    </ActionMenu.Group>
  </ActionMenu.Content>
</ActionMenu.Root>
```

### Disabled Items

```tsx
<ActionMenu.Item icon={<LockIcon />} action="lock" disabled={true}>
  Lock (Disabled)
</ActionMenu.Item>
```
