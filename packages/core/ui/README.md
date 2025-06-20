# @yoopta/ui

UI компоненты для Yoopta Editor, построенные на основе shadcn/ui с возможностью кастомизации.

## Установка

```bash
npm install @yoopta/ui
```

## Использование

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

Компонент для отображения меню опций блока (как в Notion).

#### Композиционный API

```jsx
import { BlockOptions } from '@yoopta/ui';
import { TrashIcon, CopyIcon, Link2Icon, TurnIcon } from 'lucide-react';

// Базовое использование
<BlockOptions.Root isOpen={isOpen} onClose={onClose} refs={refs} style={style}>
  <BlockOptions.Content>
    <BlockOptions.Group>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<TrashIcon />} onClick={onDelete}>
          Delete
        </BlockOptions.Button>
      </BlockOptions.Item>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<CopyIcon />} onClick={onDuplicate}>
          Duplicate
        </BlockOptions.Button>
      </BlockOptions.Item>
      <BlockOptions.Separator />
      <BlockOptions.Item>
        <BlockOptions.Button icon={<Link2Icon />} onClick={onCopy}>
          Copy link to block
        </BlockOptions.Button>
      </BlockOptions.Item>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>

// С кастомизацией стилей
<BlockOptions.Root isOpen={isOpen} onClose={onClose} refs={refs} style={style}>
  <BlockOptions.Content className="my-content">
    <BlockOptions.Group className="my-group">
      <BlockOptions.Item>
        <BlockOptions.Button
          icon={<TrashIcon />}
          onClick={onDelete}
          className="my-button"
          style={{ color: 'red' }}
        >
          Delete
        </BlockOptions.Button>
      </BlockOptions.Item>
      <BlockOptions.Separator className="my-separator" />
      <BlockOptions.Item>
        <BlockOptions.Button
          icon={<CopyIcon />}
          onClick={onDuplicate}
          className="my-button"
        >
          Duplicate
        </BlockOptions.Button>
      </BlockOptions.Item>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>

// С кастомными действиями
<BlockOptions.Root isOpen={isOpen} onClose={onClose} refs={refs} style={style}>
  <BlockOptions.Content>
    <BlockOptions.Group>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<TrashIcon />} onClick={onDelete}>
          Delete
        </BlockOptions.Button>
      </BlockOptions.Item>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<CopyIcon />} onClick={onDuplicate}>
          Duplicate
        </BlockOptions.Button>
      </BlockOptions.Item>
    </BlockOptions.Group>
    <BlockOptions.Separator />
    <BlockOptions.Group>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<Link2Icon />} onClick={onCopy}>
          Copy link
        </BlockOptions.Button>
      </BlockOptions.Item>
      <BlockOptions.Item>
        <BlockOptions.Button icon={<TurnIcon />} onClick={onTurnInto}>
          Turn into
        </BlockOptions.Button>
      </BlockOptions.Item>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>
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
}
```

## Поддержка темной темы

Компоненты автоматически адаптируются к темной теме через CSS медиа-запросы.
