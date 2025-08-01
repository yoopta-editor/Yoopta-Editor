# YooptaDndKit

A powerful drag and drop component for Yoopta Editor, built on top of `@dnd-kit` with modern design and smooth animations.

## Features

- ✨ Modern drag and drop functionality
- 🎨 Beautiful design with smooth animations
- 🔧 Built on top of @dnd-kit
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎯 Precise positioning and collision detection
- 🎭 Context-based state management
- 🎪 Compositional API for maximum flexibility

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { YooptaDndKit, useYooptaDndKit } from '@yoopta/ui';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const MySortableList = () => {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  const { activeId } = useYooptaDndKit();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <YooptaDndKit.Root items={items.map((item) => item.id)} onDragEnd={handleDragEnd}>
      <div>
        {items.map((item) => (
          <YooptaDndKit.Item key={item.id} id={item.id}>
            <div style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
              <span>{item.content}</span>
              <div style={{ cursor: 'grab' }}>⋮⋮</div>
            </div>
          </YooptaDndKit.Item>
        ))}
      </div>

      <YooptaDndKit.Overlay>
        {activeItem ? <div style={{ padding: '12px', background: '#ffffff' }}>{activeItem.content}</div> : null}
      </YooptaDndKit.Overlay>
    </YooptaDndKit.Root>
  );
};
```

### With Custom Configuration

```tsx
import { YooptaDndKit, useYooptaDndKit } from '@yoopta/ui';

const MyComponent = () => {
  const { sensors, activeId, isDragging, dragOverlay, handlers } = useYooptaDndKit({
    onDragStart: (event) => console.log('Drag started:', event),
    onDragEnd: (event) => console.log('Drag ended:', event),
    activationConstraint: { distance: 10 },
    collisionDetection: closestCenter,
    measuring: {
      droppable: {
        strategy: MeasuringStrategy.Always,
      },
    },
  });

  return (
    <YooptaDndKit.Root
      sensors={sensors}
      onDragStart={handlers.handleDragStart}
      onDragEnd={handlers.handleDragEnd}
      collisionDetection={collisionDetection}
      measuring={measuring}
    >
      {/* Your sortable items */}
      <dragOverlay.DragOverlayComponent dropAnimation={dragOverlay.dropAnimation}>
        {/* Drag overlay content */}
      </dragOverlay.DragOverlayComponent>
    </YooptaDndKit.Root>
  );
};
```

### With Context Provider

```tsx
import { YooptaDndKit, useYooptaDndKitContext } from '@yoopta/ui';

const MyComponent = () => {
  const { activeId, isDragging } = useYooptaDndKitContext();

  return (
    <YooptaDndKit.Root>
      <div>
        {items.map((item) => (
          <YooptaDndKit.Item key={item.id} id={item.id} disabled={item.disabled}>
            <div className={isDragging && activeId === item.id ? 'dragging' : ''}>{item.content}</div>
          </YooptaDndKit.Item>
        ))}
      </div>
    </YooptaDndKit.Root>
  );
};
```

## API

### YooptaDndKit.Root

The main container component that manages drag and drop functionality.

```tsx
<YooptaDndKit.Root
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  onDragStart?: (event: DragStartEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  activationConstraint?: PointerActivationConstraint
  collisionDetection?: any
  measuring?: any
  modifiers?: any[]
  items?: string[]
  strategy?: any
  disabled?: boolean
>
  {/* DnD content */}
</YooptaDndKit.Root>
```

### YooptaDndKit.Item

A draggable item component.

```tsx
<YooptaDndKit.Item
  id: string
  disabled?: boolean
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  data?: Record<string, any>
>
  {/* Item content */}
</YooptaDndKit.Item>
```

### YooptaDndKit.Overlay

A drag overlay component for visual feedback.

```tsx
<YooptaDndKit.Overlay
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  dropAnimation?: any
  modifiers?: any[]
  zIndex?: number
>
  {/* Overlay content */}
</YooptaDndKit.Overlay>
```

## Hooks

### useYooptaDndKit

Provides YooptaDndKit state and configuration.

```tsx
const {
  sensors,
  activeId,
  isDragging,
  dragOverlay,
  handlers
} = useYooptaDndKit({
  onDragStart?: (event: DragStartEvent) => void,
  onDragEnd?: (event: DragEndEvent) => void,
  onDragOver?: (event: DragOverEvent) => void,
  activationConstraint?: PointerActivationConstraint,
  collisionDetection?: any,
  measuring?: any,
  modifiers?: any[],
  items?: string[],
  strategy?: any,
  disabled?: boolean
});
```

### useYooptaDndKitContext

Access the YooptaDndKit context directly.

```tsx
const { state, actions } = useYooptaDndKitContext();
```

## Props

### YooptaDndKit.Root

| Prop                   | Type                              | Default                       | Description                   |
| ---------------------- | --------------------------------- | ----------------------------- | ----------------------------- |
| `children`             | `ReactNode`                       | -                             | Child components              |
| `className`            | `string`                          | -                             | Additional CSS classes        |
| `style`                | `React.CSSProperties`             | -                             | Inline styles                 |
| `onDragStart`          | `(event: DragStartEvent) => void` | -                             | Drag start callback           |
| `onDragEnd`            | `(event: DragEndEvent) => void`   | -                             | Drag end callback             |
| `onDragOver`           | `(event: DragOverEvent) => void`  | -                             | Drag over callback            |
| `activationConstraint` | `PointerActivationConstraint`     | `{ distance: 8 }`             | Activation constraints        |
| `collisionDetection`   | `any`                             | `closestCenter`               | Collision detection algorithm |
| `measuring`            | `any`                             | -                             | Measuring configuration       |
| `modifiers`            | `any[]`                           | -                             | Modifiers                     |
| `items`                | `string[]`                        | `[]`                          | Array of item IDs for sorting |
| `strategy`             | `any`                             | `verticalListSortingStrategy` | Sorting strategy              |
| `disabled`             | `boolean`                         | `false`                       | Disable functionality         |

### YooptaDndKit.Item

| Prop        | Type                  | Default | Description            |
| ----------- | --------------------- | ------- | ---------------------- |
| `id`        | `string`              | -       | Unique item ID         |
| `disabled`  | `boolean`             | `false` | Disable item           |
| `children`  | `ReactNode`           | -       | Item content           |
| `className` | `string`              | -       | Additional CSS classes |
| `style`     | `React.CSSProperties` | -       | Inline styles          |
| `data`      | `Record<string, any>` | -       | Additional data        |

### YooptaDndKit.Overlay

| Prop            | Type                  | Default | Description            |
| --------------- | --------------------- | ------- | ---------------------- |
| `children`      | `ReactNode`           | -       | Overlay content        |
| `className`     | `string`              | -       | Additional CSS classes |
| `style`         | `React.CSSProperties` | -       | Inline styles          |
| `dropAnimation` | `any`                 | -       | Drop animation         |
| `modifiers`     | `any[]`               | -       | Modifiers              |
| `zIndex`        | `number`              | `999`   | Z-index                |

### useYooptaDndKit Options

| Prop                   | Type                              | Default                       | Description                   |
| ---------------------- | --------------------------------- | ----------------------------- | ----------------------------- |
| `onDragStart`          | `(event: DragStartEvent) => void` | -                             | Drag start callback           |
| `onDragEnd`            | `(event: DragEndEvent) => void`   | -                             | Drag end callback             |
| `onDragOver`           | `(event: DragOverEvent) => void`  | -                             | Drag over callback            |
| `activationConstraint` | `PointerActivationConstraint`     | `{ distance: 8 }`             | Activation constraints        |
| `collisionDetection`   | `any`                             | `closestCenter`               | Collision detection algorithm |
| `measuring`            | `any`                             | -                             | Measuring configuration       |
| `modifiers`            | `any[]`                           | -                             | Modifiers                     |
| `items`                | `string[]`                        | `[]`                          | Array of item IDs for sorting |
| `strategy`             | `any`                             | `verticalListSortingStrategy` | Sorting strategy              |
| `disabled`             | `boolean`                         | `false`                       | Disable functionality         |

## Design Features

- **Modern Design**: Clean, minimal design with subtle shadows and rounded corners
- **Smooth Animations**: Elegant drag animations and transitions
- **Visual Feedback**: Clear visual indicators for drag states
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Context Management**: Centralized state management with React Context

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  /* YooptaDndKit variables */
  --yoopta-ui-dnd-kit-bg: transparent;
  --yoopta-ui-sortable-item-bg: #ffffff;
  --yoopta-ui-sortable-item-border: #e5e7eb;
  --yoopta-ui-sortable-item-hover-bg: #f9fafb;
  --yoopta-ui-sortable-item-dragging-opacity: 0.5;
  --yoopta-ui-sortable-item-over-border: 2px solid #007aff;

  /* YooptaDragOverlay variables */
  --yoopta-ui-drag-overlay-bg: rgba(255, 255, 255, 0.95);
  --yoopta-ui-drag-overlay-border: #e5e7eb;
  --yoopta-ui-drag-overlay-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  --yoopta-ui-drag-overlay-border-radius: 8px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-sortable-item-bg: #1f2937;
    --yoopta-ui-sortable-item-border: #374151;
    --yoopta-ui-sortable-item-hover-bg: #374151;
    --yoopta-ui-drag-overlay-bg: rgba(31, 41, 55, 0.95);
    --yoopta-ui-drag-overlay-border: #374151;
  }
}
```

## Examples

### Basic Sortable List

```tsx
<YooptaDndKit.Root items={itemIds} onDragEnd={handleDragEnd}>
  {items.map((item) => (
    <YooptaDndKit.Item key={item.id} id={item.id}>
      <div className="sortable-item">
        <span>{item.content}</span>
        <div className="drag-handle">⋮⋮</div>
      </div>
    </YooptaDndKit.Item>
  ))}
  <YooptaDndKit.Overlay>{activeItem && <div className="drag-overlay">{activeItem.content}</div>}</YooptaDndKit.Overlay>
</YooptaDndKit.Root>
```

### Grid Layout

```tsx
<YooptaDndKit.Root
  items={itemIds}
  onDragEnd={handleDragEnd}
  strategy={rectSortingStrategy}
  collisionDetection={rectIntersection}
>
  <div className="grid-layout">
    {items.map((item) => (
      <YooptaDndKit.Item key={item.id} id={item.id}>
        <div className="grid-item">{item.content}</div>
      </YooptaDndKit.Item>
    ))}
  </div>
  <YooptaDndKit.Overlay>{activeItem && <div className="grid-overlay">{activeItem.content}</div>}</YooptaDndKit.Overlay>
</YooptaDndKit.Root>
```

### With Custom Sensors

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  }),
);

<YooptaDndKit.Root sensors={sensors} items={itemIds} onDragEnd={handleDragEnd}>
  {/* Items */}
</YooptaDndKit.Root>;
```

### Disabled Items

```tsx
<YooptaDndKit.Root items={itemIds} onDragEnd={handleDragEnd}>
  {items.map((item) => (
    <YooptaDndKit.Item key={item.id} id={item.id} disabled={item.disabled}>
      <div className={item.disabled ? 'disabled-item' : 'sortable-item'}>{item.content}</div>
    </YooptaDndKit.Item>
  ))}
</YooptaDndKit.Root>
```

### Custom Drop Animation

```tsx
<YooptaDndKit.Root items={itemIds} onDragEnd={handleDragEnd}>
  {/* Items */}
  <YooptaDndKit.Overlay dropAnimation={dropAnimationConfig}>
    {activeItem && <div className="custom-overlay">{activeItem.content}</div>}
  </YooptaDndKit.Overlay>
</YooptaDndKit.Root>
```
