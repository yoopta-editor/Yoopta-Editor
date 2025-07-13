# @yoopta/ui

UI компоненты для Yoopta Editor, построенные на основе shadcn/ui с возможностью кастомизации.

## Components

### Toolbar

A modern, floating toolbar component for text formatting and block actions, designed in the style of shadcn/ui.

#### Features

- ✨ Floating positioning with smooth animations
- 🎨 Modern design with hover effects
- 🔧 Automatic selection detection
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎯 Precise positioning with floating UI

#### Usage

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
        </Toolbar.Content>
      </Toolbar.Root>
    </ToolbarProvider>
  );
};
```

#### API

##### ToolbarProvider

The provider component that manages toolbar state and positioning.

```tsx
<ToolbarProvider>{/* Toolbar components */}</ToolbarProvider>
```

##### Toolbar.Root

The main container component that handles positioning and portal rendering.

```tsx
<Toolbar.Root className?: string>
  {/* Toolbar content */}
</Toolbar.Root>
```

##### Toolbar.Content

The content wrapper with styling and backdrop blur.

```tsx
<Toolbar.Content className?: string>
  {/* Toolbar groups */}
</Toolbar.Content>
```

##### Toolbar.Group

Groups related toolbar items together.

```tsx
<Toolbar.Group className?: string>
  {/* Toolbar buttons */}
</Toolbar.Group>
```

##### Toolbar.Button

A regular button for toolbar actions.

```tsx
<Toolbar.Button
  icon?: React.ReactNode
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
>
  Button text
</Toolbar.Button>
```

##### Toolbar.Toggle

A toggle button for formatting actions.

```tsx
<Toolbar.Toggle
  icon?: React.ReactNode
  active?: boolean
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
>
  Toggle text
</Toolbar.Toggle>
```

##### Toolbar.Separator

A visual separator between toolbar groups.

```tsx
<Toolbar.Separator className?: string />
```

#### Hooks

##### useToolbarActions

Provides common toolbar actions for text formatting.

```tsx
const { toggleMark, toggleAlign, isMarkActive, getCurrentAlign } = useToolbarActions();

// Toggle text formatting
toggleMark('bold');
toggleMark('italic');

// Toggle text alignment
toggleAlign();

// Check if mark is active
const isBold = isMarkActive('bold');

// Get current alignment
const align = getCurrentAlign(); // 'left' | 'center' | 'right'
```

#### Design Features

- **Floating Positioning**: Automatically positions above selected text
- **Smooth Animations**: Elegant fade-in and hover effects
- **Selection Detection**: Automatically shows/hides based on text selection
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation

## Установка

```bash
npm install @yoopta/ui
```

## Использование

### YooptaDndKit

Компоненты для drag and drop функциональности на основе `@dnd-kit`.

#### Базовое использование

```jsx
import { YooptaDndKit, useYooptaDndKit } from '@yoopta/ui/dnd-kit';
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

#### Subimport использование

```jsx
import { YooptaDndKit, useYooptaDndKit } from '@yoopta/ui/dnd-kit';

// То же самое использование, но с отдельным импортом
<YooptaDndKit.Root items={itemIds} onDragEnd={handleDragEnd}>
  {items.map((item) => (
    <YooptaDndKit.Item key={item.id} id={item.id}>
      {item.content}
    </YooptaDndKit.Item>
  ))}
  <YooptaDndKit.Overlay>{activeItem && <div>{activeItem.content}</div>}</YooptaDndKit.Overlay>
</YooptaDndKit.Root>;
```

#### Использование хука напрямую

```jsx
import { useYooptaDndKit } from '@yoopta/ui';

function MyComponent() {
  const { sensors, activeId, isDragging, dragOverlay, handlers } = useYooptaDndKit({
    onDragStart: (event) => console.log('Drag started:', event),
    onDragEnd: (event) => console.log('Drag ended:', event),
    activationConstraint: { distance: 10 },
  });

  return (
    <DndContext sensors={sensors} onDragStart={handlers.handleDragStart} onDragEnd={handlers.handleDragEnd}>
      {/* Your sortable items */}
      <dragOverlay.DragOverlayComponent dropAnimation={dragOverlay.dropAnimation}>
        {/* Drag overlay content */}
      </dragOverlay.DragOverlayComponent>
    </DndContext>
  );
}
```

### FloatingBlockActions

Компонент для отображения плавающих действий блока (как в Notion).

#### Композиционный API (рекомендуется)

```jsx
import { FloatingBlockActions } from '@yoopta/ui';
import { Trash2Icon, SettingsIcon } from 'lucide-react';

// Базовое использование
<FloatingBlockActions.Root hideDelay={100}>
  <FloatingBlockActions.PlusAction />
  <FloatingBlockActions.DragAction />
</FloatingBlockActions.Root>

// С кастомными действиями
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

// С кастомными иконками
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

// С кастомизацией стилей
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

#### Legacy API (с actions prop)

```jsx
import { FloatingBlockActions } from '@yoopta/ui';

// Базовое использование с автоматическим hover
<FloatingBlockActions
  onPlusClick={(blockId) => console.log('Add block after:', blockId)}
  onDragClick={(blockId) => console.log('Select block:', blockId)}
  onDragStart={(event, blockId) => console.log('Start drag:', blockId)}
/>

// С кастомизацией
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

// С кастомными иконками
<FloatingBlockActions
  icons={{
    plus: <CustomPlusIcon />,
    drag: <CustomDragIcon />
  }}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>

// С кастомными действиями
<FloatingBlockActions
  actions={[
    'drag',
    <CustomDeleteButton key="delete" onClick={handleDelete} />,
    'plus'
  ]}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>

// Комбинирование встроенных и кастомных действий
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

#### Использование хука напрямую

```jsx
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

### BlockOptions

A beautiful, modern dropdown menu component for block actions, designed in the style of shadcn/ui.

#### Features

- ✨ Modern design with smooth animations
- 🎨 Support for light and dark themes
- 🔧 Customizable variants and sizes
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎯 Precise positioning with floating UI

#### Usage

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

#### API

##### BlockOptions.Root

The main container component that handles positioning and portal rendering.

```tsx
<BlockOptions.Root className?: string>
  {/* BlockOptions content */}
</BlockOptions.Root>
```

##### BlockOptions.Content

The content wrapper with styling and backdrop blur.

```tsx
<BlockOptions.Content className?: string>
  {/* Menu items */}
</BlockOptions.Content>
```

##### BlockOptions.Group

Groups related menu items together.

```tsx
<BlockOptions.Group className?: string>
  {/* Menu items */}
</BlockOptions.Group>
```

##### BlockOptions.Button

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

**Props:**

- `icon` - Optional icon element (recommended: Lucide React icons)
- `variant` - Button style variant (`default` or `destructive`)
- `size` - Button size (`sm` or `md`)
- `className` - Additional CSS classes
- `onClick` - Click handler

##### BlockOptions.Separator

A visual separator between menu groups.

```tsx
<BlockOptions.Separator className?: string />
```

#### Design Features

- **Modern Aesthetics**: Clean, minimal design with subtle shadows and rounded corners
- **Smooth Animations**: Elegant fade-in and hover effects using CSS transitions
- **Color System**: HSL-based color palette with proper contrast ratios
- **Dark Mode**: Automatic dark theme support with `prefers-color-scheme`
- **Accessibility**: Proper focus states, keyboard navigation, and ARIA attributes
- **Responsive**: Adapts to different screen sizes and content lengths

#### CSS Custom Properties

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
  /* ... more variables */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme overrides */
    --yoopta-ui-block-options-bg: hsl(222.2 84% 4.9%);
    --yoopta-ui-block-options-text: hsl(210 40% 98%);
    /* ... more variables */
  }
}
```

#### Examples

**Basic Menu:**

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

**Multiple Groups:**

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

**Small Size Variant:**

```tsx
<BlockOptions.Button icon={<EditIcon />} size="sm">
  Quick Edit
</BlockOptions.Button>
```

### Button

Базовый компонент кнопки с вариантами стилей.

```jsx
import { Button } from '@yoopta/ui';

// Разные варианты
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="floating">Floating</Button>

// Разные размеры
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
<Button size="floating">Floating</Button>
```

## API

### YooptaDndKit.Root

| Prop                   | Type                              | Default                       | Description                        |
| ---------------------- | --------------------------------- | ----------------------------- | ---------------------------------- |
| `children`             | `ReactNode`                       | -                             | Дочерние компоненты                |
| `className`            | `string`                          | -                             | Дополнительные CSS классы          |
| `style`                | `React.CSSProperties`             | -                             | Инлайн стили                       |
| `onDragStart`          | `(event: DragStartEvent) => void` | -                             | Callback при начале drag           |
| `onDragEnd`            | `(event: DragEndEvent) => void`   | -                             | Callback при окончании drag        |
| `onDragOver`           | `(event: DragOverEvent) => void`  | -                             | Callback при перетаскивании        |
| `activationConstraint` | `PointerActivationConstraint`     | `{ distance: 8 }`             | Ограничения активации              |
| `collisionDetection`   | `any`                             | `closestCenter`               | Алгоритм определения коллизий      |
| `measuring`            | `any`                             | -                             | Настройки измерения                |
| `modifiers`            | `any[]`                           | -                             | Модификаторы                       |
| `items`                | `string[]`                        | `[]`                          | Массив ID элементов для сортировки |
| `strategy`             | `any`                             | `verticalListSortingStrategy` | Стратегия сортировки               |
| `disabled`             | `boolean`                         | `false`                       | Отключение функциональности        |

### YooptaDndKit.Item

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `id`        | `string`              | -       | Уникальный ID элемента    |
| `disabled`  | `boolean`             | `false` | Отключение элемента       |
| `children`  | `ReactNode`           | -       | Дочерние компоненты       |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `data`      | `Record<string, any>` | -       | Дополнительные данные     |

### YooptaDndKit.Overlay

| Prop            | Type                  | Default | Description               |
| --------------- | --------------------- | ------- | ------------------------- |
| `children`      | `ReactNode`           | -       | Дочерние компоненты       |
| `className`     | `string`              | -       | Дополнительные CSS классы |
| `style`         | `React.CSSProperties` | -       | Инлайн стили              |
| `dropAnimation` | `any`                 | -       | Анимация при сбросе       |
| `modifiers`     | `any[]`               | -       | Модификаторы              |
| `zIndex`        | `number`              | `999`   | Z-index                   |

### FloatingBlockActions.Root

| Prop            | Type                                                 | Default                    | Description                              |
| --------------- | ---------------------------------------------------- | -------------------------- | ---------------------------------------- |
| `readOnly`      | `boolean`                                            | `false`                    | Флаг только для чтения                   |
| `hideDelay`     | `number`                                             | `150`                      | Задержка скрытия в мс                    |
| `throttleDelay` | `number`                                             | `100`                      | Throttle для mousemove в мс              |
| `className`     | `string`                                             | -                          | Дополнительные CSS классы                |
| `style`         | `React.CSSProperties`                                | -                          | Инлайн стили                             |
| `onBlockHover`  | `(blockId: string \| null) => void`                  | -                          | Callback при наведении на блок           |
| `onPlusClick`   | `(blockId: string) => void`                          | -                          | Callback при клике по кнопке Plus        |
| `onDragClick`   | `(blockId: string) => void`                          | -                          | Callback при клике по кнопке Drag        |
| `onDragStart`   | `(event: React.MouseEvent, blockId: string) => void` | -                          | Callback при начале drag                 |
| `icons`         | `{ plus?: ReactNode; drag?: ReactNode }`             | -                          | Кастомные иконки                         |
| `actions`       | `Array<'plus' \| 'drag' \| ReactNode>`               | -                          | Массив действий (legacy API)             |
| `animate`       | `boolean`                                            | `true`                     | Анимация появления                       |
| `portalId`      | `string`                                             | `'floating-block-actions'` | Портальный ID                            |
| `children`      | `ReactNode`                                          | -                          | Дочерние компоненты (композиционный API) |

### FloatingBlockActions.PlusAction

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |

### FloatingBlockActions.DragAction

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |

### FloatingBlockActions.Action

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `children`  | `ReactNode`           | -       | Содержимое действия       |

### BlockOptions.Root

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `isOpen`    | `boolean`             | -       | Флаг открытия меню        |
| `onClose`   | `() => void`          | -       | Callback закрытия         |
| `refs`      | `any`                 | -       | Refs для позиционирования |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `children`  | `ReactNode`           | -       | Дочерние компоненты       |

### BlockOptions.Content

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `children`  | `ReactNode`           | -       | Дочерние компоненты       |

### BlockOptions.Group

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `children`  | `ReactNode`           | -       | Дочерние компоненты       |

### BlockOptions.Item

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |
| `children`  | `ReactNode`           | -       | Дочерние компоненты       |

### BlockOptions.Button

| Prop        | Type                   | Default | Description               |
| ----------- | ---------------------- | ------- | ------------------------- |
| `icon`      | `ReactNode`            | -       | Иконка кнопки             |
| `children`  | `ReactNode`            | -       | Текст кнопки              |
| `className` | `string`               | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties`  | -       | Инлайн стили              |
| `...rest`   | `ButtonHTMLAttributes` | -       | Остальные props кнопки    |

### BlockOptions.Separator

| Prop        | Type                  | Default | Description               |
| ----------- | --------------------- | ------- | ------------------------- |
| `className` | `string`              | -       | Дополнительные CSS классы |
| `style`     | `React.CSSProperties` | -       | Инлайн стили              |

### Button

| Prop        | Type                                                                                        | Default     | Description               |
| ----------- | ------------------------------------------------------------------------------------------- | ----------- | ------------------------- |
| `variant`   | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'floating'` | `'default'` | Вариант стиля             |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'floating'`                                         | `'default'` | Размер кнопки             |
| `className` | `string`                                                                                    | -           | Дополнительные CSS классы |

## Требования к DOM

Для работы `FloatingBlockActions` блоки должны иметь следующие data-атрибуты:

```html
<div data-yoopta-block data-yoopta-block-id="block-1" data-yoopta-block-type="paragraph" data-yoopta-block-order="0">
  Содержимое блока
</div>
```

## Кастомизация

### Через CSS классы

```css
/* Переопределение стилей YooptaDndKit */
.yoo-dnd-kit {
  background: #f8f9fa !important;
}

.yoo-sortable-item {
  background: #ffffff !important;
  border-color: #dee2e6 !important;
}

.yoo-sortable-item:hover {
  background: #f8f9fa !important;
}

.yoo-drag-overlay {
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

/* Переопределение стилей BlockOptions */
.yoo-block-options-content {
  background: #1f2937 !important;
  border-color: #374151 !important;
}

.yoo-block-options-button {
  color: #d1d5db !important;
}

.yoo-block-options-button:hover {
  background-color: #374151 !important;
}

.yoo-block-options-separator {
  background-color: #374151 !important;
}

/* Переопределение стилей FloatingBlockActions */
.yoo-floating-block-actions {
  background: rgba(0, 0, 0, 0.8) !important;
}

.yoo-plus-button-action {
  background: blue !important;
}

.yoo-drag-button-action {
  background: green !important;
}

.yoo-button-action {
  background: red !important;
}
```

### Через CSS переменные

```css
:root {
  --yoopta-ui-floating-block-actions-gap: 4px;
  --yoopta-ui-button-hover-bg: #e5e7eb;
  --yoopta-ui-plus-button-color: #374151;
  --yoopta-ui-drag-button-color: #374151;
  --yoopta-ui-button-action-color: #374151;

  /* Block options variables */
  --yoopta-ui-block-options-bg: #ffffff;
  --yoopta-ui-block-options-border: #e5e7eb;
  --yoopta-ui-block-options-text: #374151;
  --yoopta-ui-block-options-hover-bg: #f3f4f6;
  --yoopta-ui-block-options-icon: #6b7280;
  --yoopta-ui-block-options-separator: #e5e7eb;

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
```

## Поддержка темной темы

Компоненты автоматически адаптируются к темной теме через CSS медиа-запросы.

### HighlightColor

Компонент для выбора цвета текста и фона с предустановленными цветами и кастомным пикером.

#### Features

- 🎨 Предустановленные цвета для текста и фона
- 🎯 Кастомный цветовой пикер
- 📱 Адаптивный дизайн
- 🌙 Поддержка темной темы
- ⚡ Debounced обновления для плавности

#### Usage

```tsx
import { HighlightColor } from '@yoopta/ui';

const MyComponent = () => {
  return (
    <HighlightColor
      editor={editor}
      highlightColors={currentColors}
      refs={floatingRefs}
      floatingStyles={floatingStyles}
      onClose={handleClose}
    />
  );
};
```

#### API

| Prop              | Type              | Default | Description               |
| ----------------- | ----------------- | ------- | ------------------------- |
| `editor`          | `YooEditor`       | -       | Экземпляр редактора       |
| `highlightColors` | `CSSProperties`   | `{}`    | Текущие цвета выделения   |
| `refs`            | `{ setFloating }` | -       | Refs для позиционирования |
| `floatingStyles`  | `CSSProperties`   | -       | Стили позиционирования    |
| `onClose`         | `() => void`      | -       | Callback закрытия         |
| `className`       | `string`          | -       | Дополнительные CSS классы |
| `style`           | `CSSProperties`   | -       | Инлайн стили              |

#### Предустановленные цвета

**Цвета текста:**

- Default (black)
- Gray (#787774)
- Brown (#976D57)
- Orange (#CC772F)
- Yellow (#C29243)
- Green (#548064)
- Blue (#477DA5)
- Purple (#A48BBE)
- Pink (#B35588)
- Red (#C4554D)

**Цвета фона:**

- Default (unset)
- Gray (#F1F1EF)
- Brown (#F3EEEE)
- Orange (#F8ECDF)
- Yellow (#FAF3DD)
- Green (#EEF3ED)
- Blue (#E9F3F7)
- Purple (#F6F3F8)
- Pink (#F9F2F5)
- Red (#FAECEC)

#### CSS переменные

```css
:root {
  --yoopta-ui-highlight-bg: hsl(0 0% 100%);
  --yoopta-ui-highlight-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-highlight-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-highlight-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-highlight-tab-bg: transparent;
  --yoopta-ui-highlight-tab-text: hsl(215.4 16.3% 46.9%);
  --yoopta-ui-highlight-tab-hover-bg: hsl(210 40% 98%);
  --yoopta-ui-highlight-tab-active-bg: hsl(210 40% 96%);
  --yoopta-ui-highlight-tab-active-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-highlight-border-color: #e3e3e3;
  --yoopta-ui-highlight-active-border: #3b82f6;
  --yoopta-ui-highlight-custom-toggle-text: hsl(215.4 16.3% 46.9%);
  --yoopta-ui-highlight-custom-toggle-hover-text: hsl(222.2 84% 4.9%);
}
```
