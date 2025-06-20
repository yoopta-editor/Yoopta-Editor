# @yoopta/ui

UI компоненты для Yoopta Editor, построенные на основе shadcn/ui с возможностью кастомизации.

## Установка

```bash
npm install @yoopta/ui
```

## Использование

### FloatingBlockActions

Компонент для отображения плавающих действий блока (как в Notion).

#### Базовое использование (без hover логики)

```jsx
import FloatingBlockActions from '@yoopta/ui/floating-block-actions';
import { Button } from '@yoopta/ui';

// Базовое использование
<FloatingBlockActions
  position={{ top: 100, left: 200 }}
  visible={true}
  onPlusClick={() => console.log('Add block')}
  onDragClick={() => console.log('Drag block')}
/>

// С кастомизацией
<FloatingBlockActions
  position={{ top: 100, left: 200 }}
  size="lg"
  variant="elegant"
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
  onDragStart={handleDragStart}
  className="my-custom-class"
/>

// С кастомными иконками
<FloatingBlockActions
  position={{ top: 100, left: 200 }}
  icons={{
    plus: <CustomPlusIcon />,
    drag: <CustomDragIcon />
  }}
  onPlusClick={handleAddBlock}
  onDragClick={handleSelectBlock}
/>

// С кастомными действиями
<FloatingBlockActions
  position={{ top: 100, left: 200 }}
  actions={
    <>
      <Button variant="floating" size="floating" onClick={handleAction1}>
        Action 1
      </Button>
      <Button variant="floating" size="floating" onClick={handleAction2}>
        Action 2
      </Button>
    </>
  }
/>
```

#### С автоматическим hover (рекомендуется)

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
  size="lg"
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

### FloatingBlockActions

| Prop            | Type                                                 | Default                    | Description                              |
| --------------- | ---------------------------------------------------- | -------------------------- | ---------------------------------------- |
| `readOnly`      | `boolean`                                            | `false`                    | Флаг только для чтения                   |
| `hideDelay`     | `number`                                             | `150`                      | Задержка скрытия в мс                    |
| `throttleDelay` | `number`                                             | `100`                      | Throttle для mousemove в мс              |
| `size`          | `'sm' \| 'md' \| 'lg'`                               | `'md'`                     | Размер кнопок                            |
| `className`     | `string`                                             | -                          | Дополнительные CSS классы                |
| `style`         | `React.CSSProperties`                                | -                          | Инлайн стили                             |
| `onBlockHover`  | `(blockId: string \| null) => void`                  | -                          | Callback при наведении на блок           |
| `onPlusClick`   | `(blockId: string) => void`                          | -                          | Callback при клике по кнопке Plus        |
| `onDragClick`   | `(blockId: string) => void`                          | -                          | Callback при клике по кнопке Drag        |
| `onDragStart`   | `(event: React.MouseEvent, blockId: string) => void` | -                          | Callback при начале drag                 |
| `icons`         | `{ plus?: ReactNode; drag?: ReactNode }`             | -                          | Кастомные иконки                         |
| `actions`       | `Array<'plus' \| 'drag' \| ReactNode>`               | -                          | Массив действий (встроенные + кастомные) |
| `animate`       | `boolean`                                            | `true`                     | Анимация появления                       |
| `portalId`      | `string`                                             | `'floating-block-actions'` | Портальный ID                            |

### FloatingBlockActionsWithHover

| Prop            | Type                                                  | Default                    | Description                       |
| --------------- | ----------------------------------------------------- | -------------------------- | --------------------------------- |
| `editorElement` | `HTMLElement \| null`                                 | -                          | Элемент редактора                 |
| `readOnly`      | `boolean`                                             | `false`                    | Флаг только для чтения            |
| `hideDelay`     | `number`                                              | `150`                      | Задержка скрытия в мс             |
| `throttleDelay` | `number`                                              | `100`                      | Throttle для mousemove в мс       |
| `size`          | `'sm' \| 'md' \| 'lg'`                                | `'md'`                     | Размер кнопок                     |
| `variant`       | `'default' \| 'minimal' \| 'elegant'`                 | `'default'`                | Вариант стиля                     |
| `className`     | `string`                                              | -                          | Дополнительные CSS классы         |
| `style`         | `React.CSSProperties`                                 | -                          | Инлайн стили                      |
| `onBlockHover`  | `(block: BlockData \| null) => void`                  | -                          | Callback при наведении на блок    |
| `onPlusClick`   | `(block: BlockData) => void`                          | -                          | Callback при клике по кнопке Plus |
| `onDragClick`   | `(block: BlockData) => void`                          | -                          | Callback при клике по кнопке Drag |
| `onDragStart`   | `(event: React.MouseEvent, block: BlockData) => void` | -                          | Callback при начале drag          |
| `icons`         | `{ plus?: ReactNode; drag?: ReactNode }`              | -                          | Кастомные иконки                  |
| `actions`       | `ReactNode`                                           | -                          | Кастомные действия                |
| `animate`       | `boolean`                                             | `true`                     | Анимация появления                |
| `portalId`      | `string`                                              | `'floating-block-actions'` | Портальный ID                     |

### Button

| Prop        | Type                                                                                        | Default     | Description               |
| ----------- | ------------------------------------------------------------------------------------------- | ----------- | ------------------------- |
| `variant`   | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'floating'` | `'default'` | Вариант стиля             |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'floating'`                                         | `'default'` | Размер кнопки             |
| `className` | `string`                                                                                    | -           | Дополнительные CSS классы |

## Требования к DOM

Для работы `FloatingBlockActionsWithHover` блоки должны иметь следующие data-атрибуты:

```html
<div data-yoopta-block data-yoopta-block-id="block-1" data-yoopta-block-type="paragraph" data-yoopta-block-order="0">
  Содержимое блока
</div>
```

## Кастомизация

### Через Tailwind CSS

```css
/* Переопределение стилей */
.yoopta-floating-actions {
  @apply bg-blue-500 border-blue-600;
}

.yoopta-button-floating {
  @apply bg-white/95 hover:bg-white shadow-xl;
}
```

### Через CSS переменные

```css
:root {
  --yoo-ui-bg-color: #ffffff;
  --yoo-ui-border-color: #e5e7eb;
  --yoo-ui-text-color: #374151;
}
```

## Поддержка темной темы

Компоненты автоматически адаптируются к темной теме через Tailwind CSS классы.
