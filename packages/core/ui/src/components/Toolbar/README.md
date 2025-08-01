# Toolbar

A modern, floating toolbar component for text formatting and block actions, designed in the style of shadcn/ui with smooth animations and precise positioning.

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
import { Toolbar, ToolbarProvider, useToolbarActions } from '@yoopta/ui';
import { BoldIcon, ItalicIcon, AlignLeftIcon } from 'lucide-react';

const MyToolbar = () => {
  const { toggleMark, isMarkActive } = useToolbarActions();

  return (
    <ToolbarProvider>
      <Toolbar.Root>
        <Toolbar.Content>
          <Toolbar.Group>
            <Toolbar.Toggle
              icon={<BoldIcon />}
              active={isMarkActive('bold')}
              onClick={() => toggleMark('bold')}
              aria-label="Bold"
            />
            <Toolbar.Toggle
              icon={<ItalicIcon />}
              active={isMarkActive('italic')}
              onClick={() => toggleMark('italic')}
              aria-label="Italic"
            />
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Button
              icon={<AlignLeftIcon />}
              onClick={() => console.log('Align left')}
              aria-label="Align Left"
            />
          </Toolbar.Group>
        </Toolbar.Content>
      </Toolbar.Root>
    </ToolbarProvider>
  );
};
```

### With Custom Actions

```tsx
import { Toolbar, useToolbarActions } from '@yoopta/ui';

const MyComponent = () => {
  const { toggleMark, toggleAlign, isMarkActive, getCurrentAlign } = useToolbarActions();

  return (
    <Toolbar.Root>
      <Toolbar.Content>
        <Toolbar.Group>
          <Toolbar.Toggle
            icon={<BoldIcon />}
            active={isMarkActive('bold')}
            onClick={() => toggleMark('bold')}
            aria-label="Bold"
          />
          <Toolbar.Toggle
            icon={<ItalicIcon />}
            active={isMarkActive('italic')}
            onClick={() => toggleMark('italic')}
            aria-label="Italic"
          />
          <Toolbar.Toggle
            icon={<UnderlineIcon />}
            active={isMarkActive('underline')}
            onClick={() => toggleMark('underline')}
            aria-label="Underline"
          />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Button
            icon={<AlignLeftIcon />}
            active={getCurrentAlign() === 'left'}
            onClick={() => toggleAlign('left')}
            aria-label="Align Left"
          />
          <Toolbar.Button
            icon={<AlignCenterIcon />}
            active={getCurrentAlign() === 'center'}
            onClick={() => toggleAlign('center')}
            aria-label="Align Center"
          />
          <Toolbar.Button
            icon={<AlignRightIcon />}
            active={getCurrentAlign() === 'right'}
            onClick={() => toggleAlign('right')}
            aria-label="Align Right"
          />
        </Toolbar.Group>
      </Toolbar.Content>
    </Toolbar.Root>
  );
};
```

## API

### ToolbarProvider

The provider component that manages toolbar state and positioning.

```tsx
<ToolbarProvider>{/* Toolbar components */}</ToolbarProvider>
```

### Toolbar.Root

The main container component that handles positioning and portal rendering.

```tsx
<Toolbar.Root className?: string>
  {/* Toolbar content */}
</Toolbar.Root>
```

### Toolbar.Content

The content wrapper with styling and backdrop blur.

```tsx
<Toolbar.Content className?: string>
  {/* Toolbar groups */}
</Toolbar.Content>
```

### Toolbar.Group

Groups related toolbar items together.

```tsx
<Toolbar.Group className?: string>
  {/* Toolbar buttons */}
</Toolbar.Group>
```

### Toolbar.Button

A regular button for toolbar actions.

```tsx
<Toolbar.Button
  icon?: React.ReactNode
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
>
  Button text
</Toolbar.Button>
```

### Toolbar.Toggle

A toggle button for formatting actions.

```tsx
<Toolbar.Toggle
  icon?: React.ReactNode
  active?: boolean
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
>
  Toggle text
</Toolbar.Toggle>
```

### Toolbar.Separator

A visual separator between toolbar groups.

```tsx
<Toolbar.Separator className?: string />
```

## Hooks

### useToolbarActions

Provides common toolbar actions for text formatting.

```tsx
const { toggleMark, toggleAlign, isMarkActive, getCurrentAlign } = useToolbarActions();

// Toggle text formatting
toggleMark('bold');
toggleMark('italic');
toggleMark('underline');

// Toggle text alignment
toggleAlign('left');
toggleAlign('center');
toggleAlign('right');

// Check if mark is active
const isBold = isMarkActive('bold');

// Get current alignment
const align = getCurrentAlign(); // 'left' | 'center' | 'right'
```

### useToolbar

Provides toolbar state and positioning logic.

```tsx
const {
  isVisible,
  position,
  showToolbar,
  hideToolbar
} = useToolbar({
  onShow?: () => void,
  onHide?: () => void
});
```

### useToolbarContext

Access the toolbar context directly.

```tsx
const { state, actions } = useToolbarContext();
```

## Props

### Toolbar.Root

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `className` | `string`    | -       | Additional CSS classes |
| `children`  | `ReactNode` | -       | Toolbar content        |

### Toolbar.Button

| Prop        | Type                                | Default     | Description                |
| ----------- | ----------------------------------- | ----------- | -------------------------- |
| `icon`      | `ReactNode`                         | -           | Button icon                |
| `variant`   | `'default' \| 'ghost' \| 'outline'` | `'default'` | Button style variant       |
| `size`      | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Button size                |
| `disabled`  | `boolean`                           | `false`     | Whether button is disabled |
| `onClick`   | `() => void`                        | -           | Click handler              |
| `className` | `string`                            | -           | Additional CSS classes     |
| `children`  | `ReactNode`                         | -           | Button text                |

### Toolbar.Toggle

| Prop        | Type                                | Default     | Description                |
| ----------- | ----------------------------------- | ----------- | -------------------------- |
| `icon`      | `ReactNode`                         | -           | Toggle icon                |
| `active`    | `boolean`                           | `false`     | Whether toggle is active   |
| `variant`   | `'default' \| 'ghost' \| 'outline'` | `'default'` | Toggle style variant       |
| `size`      | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Toggle size                |
| `disabled`  | `boolean`                           | `false`     | Whether toggle is disabled |
| `onClick`   | `() => void`                        | -           | Click handler              |
| `className` | `string`                            | -           | Additional CSS classes     |
| `children`  | `ReactNode`                         | -           | Toggle text                |

## Design Features

- **Floating Positioning**: Automatically positions above selected text
- **Smooth Animations**: Elegant fade-in and hover effects
- **Selection Detection**: Automatically shows/hides based on text selection
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Context Management**: Centralized state management with React Context

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --yoopta-ui-toolbar-bg: hsl(0 0% 100%);
  --yoopta-ui-toolbar-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-toolbar-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-toolbar-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-toolbar-hover-bg: hsl(210 40% 98%);
  --yoopta-ui-toolbar-active-bg: hsl(210 40% 96%);
  --yoopta-ui-toolbar-separator: hsl(214.3 31.8% 91.4%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-toolbar-bg: hsl(222.2 84% 4.9%);
    --yoopta-ui-toolbar-text: hsl(210 40% 98%);
    --yoopta-ui-toolbar-hover-bg: hsl(217.2 32.6% 17.5%);
    --yoopta-ui-toolbar-active-bg: hsl(215.4 16.3% 46.9%);
  }
}
```

## Examples

### Text Formatting Toolbar

```tsx
<Toolbar.Root>
  <Toolbar.Content>
    <Toolbar.Group>
      <Toolbar.Toggle
        icon={<BoldIcon />}
        active={isMarkActive('bold')}
        onClick={() => toggleMark('bold')}
        aria-label="Bold"
      />
      <Toolbar.Toggle
        icon={<ItalicIcon />}
        active={isMarkActive('italic')}
        onClick={() => toggleMark('italic')}
        aria-label="Italic"
      />
      <Toolbar.Toggle
        icon={<UnderlineIcon />}
        active={isMarkActive('underline')}
        onClick={() => toggleMark('underline')}
        aria-label="Underline"
      />
      <Toolbar.Toggle
        icon={<StrikethroughIcon />}
        active={isMarkActive('strikethrough')}
        onClick={() => toggleMark('strikethrough')}
        aria-label="Strikethrough"
      />
    </Toolbar.Group>
  </Toolbar.Content>
</Toolbar.Root>
```

### Alignment Toolbar

```tsx
<Toolbar.Root>
  <Toolbar.Content>
    <Toolbar.Group>
      <Toolbar.Button
        icon={<AlignLeftIcon />}
        active={getCurrentAlign() === 'left'}
        onClick={() => toggleAlign('left')}
        aria-label="Align Left"
      />
      <Toolbar.Button
        icon={<AlignCenterIcon />}
        active={getCurrentAlign() === 'center'}
        onClick={() => toggleAlign('center')}
        aria-label="Align Center"
      />
      <Toolbar.Button
        icon={<AlignRightIcon />}
        active={getCurrentAlign() === 'right'}
        onClick={() => toggleAlign('right')}
        aria-label="Align Right"
      />
      <Toolbar.Button
        icon={<AlignJustifyIcon />}
        active={getCurrentAlign() === 'justify'}
        onClick={() => toggleAlign('justify')}
        aria-label="Justify"
      />
    </Toolbar.Group>
  </Toolbar.Content>
</Toolbar.Root>
```

### Mixed Toolbar with Separators

```tsx
<Toolbar.Root>
  <Toolbar.Content>
    <Toolbar.Group>
      <Toolbar.Toggle
        icon={<BoldIcon />}
        active={isMarkActive('bold')}
        onClick={() => toggleMark('bold')}
        aria-label="Bold"
      />
      <Toolbar.Toggle
        icon={<ItalicIcon />}
        active={isMarkActive('italic')}
        onClick={() => toggleMark('italic')}
        aria-label="Italic"
      />
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Group>
      <Toolbar.Button icon={<LinkIcon />} onClick={() => console.log('Add link')} aria-label="Add Link" />
      <Toolbar.Button icon={<ImageIcon />} onClick={() => console.log('Add image')} aria-label="Add Image" />
    </Toolbar.Group>
  </Toolbar.Content>
</Toolbar.Root>
```

### Disabled States

```tsx
<Toolbar.Toggle icon={<LockIcon />} disabled={true} aria-label="Lock (Disabled)" />
```
