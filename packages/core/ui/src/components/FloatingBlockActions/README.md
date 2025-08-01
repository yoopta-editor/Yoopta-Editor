# FloatingBlockActions

A modern floating block actions component for Yoopta Editor, inspired by Notion's block hover actions with smooth animations and precise positioning.

## Features

- ✨ Floating positioning with smooth animations
- 🎨 Modern design with hover effects
- 🔧 Automatic block detection and positioning
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎯 Precise positioning with floating UI
- 🎭 Context-based state management
- 🎪 Compositional API for maximum flexibility

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Compositional API (Recommended)

```tsx
import { FloatingBlockActions } from '@yoopta/ui';
import { Trash2Icon, SettingsIcon } from 'lucide-react';

// Basic usage
<FloatingBlockActions.Root hideDelay={100}>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>

// With custom actions
<FloatingBlockActions.Root
  hideDelay={100}
  onPlusClick={(blockId) => console.log('Add block after:', blockId)}
  onDragClick={(blockId) => console.log('Select block:', blockId)}
>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
  <FloatingBlockActions.Action>
    <Trash2Icon size={16} />
  </FloatingBlockActions.Action>
  <FloatingBlockActions.Action>
    <SettingsIcon size={16} />
  </FloatingBlockActions.Action>
</FloatingBlockActions.Root>

// With custom icons
<FloatingBlockActions.Root
  icons={{
    plus: <CustomPlusIcon />,
    drag: <CustomDragIcon />
  }}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>

// With custom styling
<FloatingBlockActions.Root className="my-container">
  <FloatingBlockActions.PlusAction
    className="my-plus-button"
    style={{ background: 'blue' }}
  />
  <FloatingBlockActions.DragAction
    className="my-drag-button"
    style={{ background: 'green' }}
  />
  <FloatingBlockActions.Action
    className="my-custom-action"
    style={{ background: 'red' }}
  >
    <Trash2Icon size={16} />
  </FloatingBlockActions.Action>
</FloatingBlockActions.Root>
```

### Legacy API (with actions prop)

```tsx
import { FloatingBlockActions } from '@yoopta/ui';

// Basic usage with automatic hover
<FloatingBlockActions
  onPlusClick={(blockId) => console.log('Add block after:', blockId)}
  onDragClick={(blockId) => console.log('Select block:', blockId)}
  onDragStart={(event, blockId) => console.log('Start drag:', blockId)}
/>

// With customization
<FloatingBlockActions
  readOnly={false}
  hideDelay={200}
  throttleDelay={50}
  onBlockHover={(blockId) => console.log('Hovered block:', blockId)}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
  onDragStart={handleDragStart}
  className="my-custom-class"
/>

// With custom icons
<FloatingBlockActions
  icons={{
    plus: <CustomPlusIcon />,
    drag: <CustomDragIcon />
  }}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>

// With custom actions
<FloatingBlockActions
  actions={[
    'drag',
    <CustomDeleteButton key="delete" onClick={handleDelete} />,
    'plus'
  ]}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>

// Combining built-in and custom actions
<FloatingBlockActions
  actions={[
    'drag',
    <Button variant="floating" size="floating" onClick={handleAction1}>Action 1</Button>,
    'plus',
    <Button variant="floating" size="floating" onClick={handleAction2}>Action 2</Button>
  ]}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>
```

### Direct Hook Usage

```tsx
import { useFloatingBlockActions } from '@yoopta/ui';

function MyComponent() {
  const { hoveredBlock, position, visible, actionsRef, handlers } = useFloatingBlockActions({
    editorElement: editorRef.current,
    onPlusClick: (block) => console.log('Add block:', block.id),
    onDragClick: (block) => console.log('Drag block:', block.id),
  });

  return (
    <div ref={actionsRef} style={{ position: 'fixed', top: position.top, left: position.left }}>
      {visible && (
        <>
          <button onClick={handlers.onPlusClick}>+</button>
          <button onClick={handlers.onDragClick}>⋮⋮</button>
        </>
      )}
    </div>
  );
}
```

## API

### FloatingBlockActions.Root

The main container component that manages positioning and hover detection.

```tsx
<FloatingBlockActions.Root
  readOnly?: boolean
  hideDelay?: number
  throttleDelay?: number
  className?: string
  style?: React.CSSProperties
  onBlockHover?: (blockId: string | null) => void
  onPlusClick?: (blockId: string) => void
  onDragClick?: (blockId: string) => void
  onDragStart?: (event: React.MouseEvent, blockId: string) => void
  icons?: { plus?: ReactNode; drag?: ReactNode }
  actions?: Array<'plus' | 'drag' | ReactNode>
  animate?: boolean
  portalId?: string
>
  {/* Action components */}
</FloatingBlockActions.Root>
```

### FloatingBlockActions.PlusAction

The plus action button for adding new blocks.

```tsx
<FloatingBlockActions.PlusAction
  className?: string
  style?: React.CSSProperties
/>
```

### FloatingBlockActions.DragAction

The drag action button for block selection and dragging.

```tsx
<FloatingBlockActions.DragAction
  className?: string
  style?: React.CSSProperties
/>
```

### FloatingBlockActions.Action

A custom action button for additional functionality.

```tsx
<FloatingBlockActions.Action
  className?: string
  style?: React.CSSProperties
>
  {/* Custom action content */}
</FloatingBlockActions.Action>
```

## Hooks

### useFloatingBlockActions

Provides floating block actions state and handlers.

```tsx
const {
  hoveredBlock,
  position,
  visible,
  actionsRef,
  handlers
} = useFloatingBlockActions({
  editorElement?: HTMLElement,
  onPlusClick?: (block: Block) => void,
  onDragClick?: (block: Block) => void,
  onDragStart?: (event: React.MouseEvent, block: Block) => void,
  onBlockHover?: (blockId: string | null) => void,
  readOnly?: boolean,
  hideDelay?: number,
  throttleDelay?: number
});
```

### useFloatingBlockActionHandlers

Provides action handlers for floating block actions.

```tsx
const {
  handlePlusClick,
  handleDragClick,
  handleDragStart
} = useFloatingBlockActionHandlers({
  onPlusClick?: (blockId: string) => void,
  onDragClick?: (blockId: string) => void,
  onDragStart?: (event: React.MouseEvent, blockId: string) => void
});
```

## Props

### FloatingBlockActions.Root

| Prop            | Type                                                 | Default                    | Description                           |
| --------------- | ---------------------------------------------------- | -------------------------- | ------------------------------------- |
| `readOnly`      | `boolean`                                            | `false`                    | Read-only mode flag                   |
| `hideDelay`     | `number`                                             | `150`                      | Hide delay in milliseconds            |
| `throttleDelay` | `number`                                             | `100`                      | Throttle delay for mousemove in ms    |
| `className`     | `string`                                             | -                          | Additional CSS classes                |
| `style`         | `React.CSSProperties`                                | -                          | Inline styles                         |
| `onBlockHover`  | `(blockId: string \| null) => void`                  | -                          | Block hover callback                  |
| `onPlusClick`   | `(blockId: string) => void`                          | -                          | Plus button click callback            |
| `onDragClick`   | `(blockId: string) => void`                          | -                          | Drag button click callback            |
| `onDragStart`   | `(event: React.MouseEvent, blockId: string) => void` | -                          | Drag start callback                   |
| `icons`         | `{ plus?: ReactNode; drag?: ReactNode }`             | -                          | Custom icons                          |
| `actions`       | `Array<'plus' \| 'drag' \| ReactNode>`               | -                          | Action array (legacy API)             |
| `animate`       | `boolean`                                            | `true`                     | Animation flag                        |
| `portalId`      | `string`                                             | `'floating-block-actions'` | Portal ID                             |
| `children`      | `ReactNode`                                          | -                          | Action components (compositional API) |

### FloatingBlockActions.PlusAction

| Prop        | Type                  | Default | Description            |
| ----------- | --------------------- | ------- | ---------------------- |
| `className` | `string`              | -       | Additional CSS classes |
| `style`     | `React.CSSProperties` | -       | Inline styles          |

### FloatingBlockActions.DragAction

| Prop        | Type                  | Default | Description            |
| ----------- | --------------------- | ------- | ---------------------- |
| `className` | `string`              | -       | Additional CSS classes |
| `style`     | `React.CSSProperties` | -       | Inline styles          |

### FloatingBlockActions.Action

| Prop        | Type                  | Default | Description            |
| ----------- | --------------------- | ------- | ---------------------- |
| `className` | `string`              | -       | Additional CSS classes |
| `style`     | `React.CSSProperties` | -       | Inline styles          |
| `children`  | `ReactNode`           | -       | Action content         |

## DOM Requirements

For `FloatingBlockActions` to work properly, blocks must have the following data attributes:

```html
<div data-yoopta-block data-yoopta-block-id="block-1" data-yoopta-block-type="paragraph" data-yoopta-block-order="0">
  Block content
</div>
```

## Design Features

- **Floating Positioning**: Automatically positions near hovered blocks
- **Smooth Animations**: Elegant fade-in and hover effects
- **Block Detection**: Automatically detects and tracks block elements
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Context Management**: Centralized state management with React Context

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --yoopta-ui-floating-block-actions-gap: 4px;
  --yoopta-ui-floating-block-actions-bg: rgba(0, 0, 0, 0.8);
  --yoopta-ui-floating-block-actions-border-radius: 6px;
  --yoopta-ui-floating-block-actions-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --yoopta-ui-plus-button-color: #ffffff;
  --yoopta-ui-drag-button-color: #ffffff;
  --yoopta-ui-button-action-color: #ffffff;
  --yoopta-ui-button-hover-bg: rgba(255, 255, 255, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-floating-block-actions-bg: rgba(255, 255, 255, 0.9);
    --yoopta-ui-plus-button-color: #000000;
    --yoopta-ui-drag-button-color: #000000;
    --yoopta-ui-button-action-color: #000000;
    --yoopta-ui-button-hover-bg: rgba(0, 0, 0, 0.1);
  }
}
```

## Examples

### Basic Block Actions

```tsx
<FloatingBlockActions.Root>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>
```

### With Custom Actions

```tsx
<FloatingBlockActions.Root>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
  <FloatingBlockActions.Action onClick={handleDelete}>
    <Trash2Icon size={16} />
  </FloatingBlockActions.Action>
  <FloatingBlockActions.Action onClick={handleSettings}>
    <SettingsIcon size={16} />
  </FloatingBlockActions.Action>
</FloatingBlockActions.Root>
```

### Read-only Mode

```tsx
<FloatingBlockActions.Root readOnly={true}>
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>
```

### Custom Styling

```tsx
<FloatingBlockActions.Root className="my-custom-actions">
  <FloatingBlockActions.PlusAction className="my-plus-button" style={{ background: 'blue' }} />
  <FloatingBlockActions.DragAction className="my-drag-button" style={{ background: 'green' }} />
</FloatingBlockActions.Root>
```

### With Event Handlers

```tsx
<FloatingBlockActions.Root
  onPlusClick={(blockId) => {
    console.log('Adding block after:', blockId);
    addNewBlock(blockId);
  }}
  onDragClick={(blockId) => {
    console.log('Selecting block:', blockId);
    selectBlock(blockId);
  }}
  onDragStart={(event, blockId) => {
    console.log('Starting drag for block:', blockId);
    startDrag(event, blockId);
  }}
>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>
```
