# SlashActionMenuList

Компонент для отображения меню с выбором типа блока при нажатии `/` (slash command).

## 🎯 Особенности

- ✅ **Автоматический триггер** - открывается при нажатии `/` в начале блока
- ✅ **Программное открытие** - можно открыть из другого компонента через `useSlashActionMenuActions`
- ✅ **Поиск** - фильтрация блоков по введенному тексту
- ✅ **Keyboard navigation** - навигация стрелками, выбор Enter, закрытие Escape
- ✅ **Inline positioning** - позиционируется относительно текстового курсора
- ✅ **Zustand store** - глобальное состояние
- ✅ **shadcn/ui style** - современный дизайн

## 📦 Архитектура

```
slash-action-menu-list/
├── store.ts                        # Zustand store
├── hooks.ts                        # useSlashActionMenu + useSlashActionMenuActions
├── slash-action-menu-list.tsx      # UI компоненты
├── slash-action-menu-list.css      # Стили
└── index.ts                        # Экспорты
```

## 🚀 Использование

### Базовый пример (автоматический триггер)

```tsx
import { SlashActionMenuList, useSlashActionMenu } from '@yoopta/ui';

const SlashCommandComponent = () => {
  const { actions, selectedAction, empty, isOpen, getItemProps, getRootProps } = useSlashActionMenu(
    { trigger: '/' },
  );

  if (!isOpen) return null;

  return (
    <SlashActionMenuList.Root>
      <SlashActionMenuList.Content {...getRootProps()}>
        <SlashActionMenuList.Group>
          {empty ? (
            <SlashActionMenuList.Empty />
          ) : (
            actions.map((action) => (
              <SlashActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === selectedAction?.type}
                {...getItemProps(action.type)}
              />
            ))
          )}
        </SlashActionMenuList.Group>
      </SlashActionMenuList.Content>
    </SlashActionMenuList.Root>
  );
};
```

### В YooptaEditor

```tsx
<YooptaEditor editor={editor} plugins={plugins}>
  <SlashCommandComponent />
</YooptaEditor>
```

### Программное открытие

Вы можете программно открыть меню из другого компонента, используя `useSlashActionMenuActions`:

```tsx
import {
  useSlashActionMenuActions,
  FloatingBlockActions,
  useFloatingBlockActions,
} from '@yoopta/ui';
import { Blocks, useYooptaEditor } from '@yoopta/editor';

const MyFloatingBlockActions = () => {
  const editor = useYooptaEditor();
  const { floatingBlockId } = useFloatingBlockActions();
  const { open: openSlashMenu } = useSlashActionMenuActions();

  const onPlusClick = () => {
    if (!floatingBlockId) return;

    const block = Blocks.getBlock(editor, { id: floatingBlockId });
    if (!block) return;

    // Insert new paragraph after current block
    const nextOrder = block.meta.order + 1;
    const nextBlockId = editor.insertBlock('Paragraph', { at: nextOrder, focus: true });

    // Wait for block to render and get cursor position
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (!range) return;

      // Create virtual reference from current cursor position
      const reference = {
        getBoundingClientRect: () => range.getBoundingClientRect(),
        getClientRects: () => range.getClientRects(),
      };

      // Open slash menu - all logic (filter, keyboard nav) will work automatically
      openSlashMenu(reference as any);
    }, 0);
  };

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.Button onClick={onPlusClick}>
        <PlusIcon />
      </FloatingBlockActions.Button>
    </FloatingBlockActions.Root>
  );
};
```

## 🎨 Компоненты

### `SlashActionMenuList.Root`

Корневой Portal компонент.

```tsx
<SlashActionMenuList.Root>{/* children */}</SlashActionMenuList.Root>
```

### `SlashActionMenuList.Content`

Контейнер с floating positioning и визуальными стилями (border, shadow, padding).
**Важно**: передайте `{...getRootProps()}`.

**Props:**

- `view?: 'small' | 'default'` - размер меню (по умолчанию `'default'`)

```tsx
<SlashActionMenuList.Content {...getRootProps()} view="default">
  {/* children */}
</SlashActionMenuList.Content>
```

### `SlashActionMenuList.Group`

Группа элементов.

```tsx
<SlashActionMenuList.Group>{/* items */}</SlashActionMenuList.Group>
```

### `SlashActionMenuList.Item`

Отдельный элемент меню.

**Props:**

- `action: ActionMenuItem` - данные блока
- `selected?: boolean` - выбран ли элемент
- `...getItemProps(action.type)` - props для keyboard navigation

```tsx
<SlashActionMenuList.Item
  key={action.type}
  action={action}
  selected={action.type === selectedAction?.type}
  {...getItemProps(action.type)}
/>
```

### `SlashActionMenuList.Empty`

Компонент для пустого состояния (нет результатов поиска).

```tsx
{empty ? <SlashActionMenuList.Empty /> : /* items */}
```

## 🎣 Hooks

### `useSlashActionMenu`

**Full hook** с Floating UI, event listeners и всей логикой. Используйте только в компоненте, который рендерит меню.

#### Параметры

```typescript
type SlashActionMenuProps = {
  trigger?: string; // По умолчанию '/'
};
```

#### Возвращаемые значения

```typescript
{
  isOpen: boolean;                 // Открыто ли меню (для рендера)
  state: 'open' | 'closed';        // Состояние меню
  actions: ActionMenuItem[];       // Отфильтрованные блоки
  selectedAction: ActionMenuItem | null; // Выбранный блок
  empty: boolean;                  // Нет результатов
  searchText: string;              // Текст поиска
  getItemProps: (type: string) => ItemProps; // Props для Item
  getRootProps: () => ContentProps; // Props для Content (с ref и style)
  onClose: () => void;             // Закрыть меню
}
```

### `useSlashActionMenuActions`

**Lightweight hook** только с actions из store. Используйте когда нужно только программно открыть/закрыть меню без его рендера.

#### Параметры

Нет параметров.

#### Возвращаемые значения

```typescript
{
  open: (reference?: HTMLElement | null) => void;  // Открыть меню
  close: () => void;                               // Закрыть меню
  isOpen: boolean;                                 // Открыто ли меню
}
```

#### Пример использования

```tsx
import { useSlashActionMenuActions } from '@yoopta/ui';

const MyComponent = () => {
  const { open: openSlashMenu } = useSlashActionMenuActions();

  const handleClick = () => {
    // Get current cursor/selection position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Create virtual reference for positioning
    const reference = {
      getBoundingClientRect: () => range.getBoundingClientRect(),
      getClientRects: () => range.getClientRects(),
    };

    // Open menu - all slash logic (filtering, keyboard nav) works automatically
    openSlashMenu(reference as any);
  };

  return <button onClick={handleClick}>Open Slash Menu</button>;
};
```

## 🎨 Стилизация

Компонент использует CSS переменные из общей UI системы Yoopta:

```css
/* Основные переменные */
--yoopta-ui-background
--yoopta-ui-foreground
--yoopta-ui-border
--yoopta-ui-accent
--yoopta-ui-muted-foreground
--yoopta-ui-ring

/* Action Menu специфичные переменные */
--yoopta-ui-action-menu-z-index: 9999
--yoopta-ui-action-menu-radius: 0.5rem
--yoopta-ui-action-menu-padding: 0.5rem
--yoopta-ui-action-menu-max-height: 330px
--yoopta-ui-action-menu-item-gap: 0.5rem
--yoopta-ui-action-menu-item-radius: 0.375rem
--yoopta-ui-action-menu-item-padding: 0.5rem
--yoopta-ui-action-menu-item-font-size: 0.875rem
```

### Кастомизация

Вы можете переопределить CSS переменные или классы:

```css
/* Переменные */
:root {
  --yoopta-ui-action-menu-max-height: 500px;
  --yoopta-ui-action-menu-item-padding: 0.75rem;
}

/* Или классы напрямую */
.yoopta-ui-slash-action-menu-list-content {
  max-height: 500px;
}

.yoopta-ui-slash-action-menu-list-item {
  padding: 0.75rem;
}

.yoopta-ui-slash-action-menu-list-item[aria-selected='true'] {
  background: your-custom-color;
}
```

## 🏗️ Store

### Zustand Store

```typescript
export type SlashActionMenuStore = {
  state: 'open' | 'closed';
  searchText: string;
  selectedIndex: number;
  styles: CSSProperties;
  reference: HTMLElement | null;

  open: (reference?: HTMLElement | null) => void;
  close: () => void;
  setSearchText: (text: string) => void;
  setSelectedIndex: (index: number) => void;
  updateStyles: (styles: CSSProperties) => void;
  setReference: (reference: HTMLElement | null) => void;
  reset: () => void;
};
```

### Прямой доступ к store (не рекомендуется)

```tsx
import { useSlashActionMenuStore } from '@yoopta/ui';

const MyComponent = () => {
  const store = useSlashActionMenuStore();

  // Доступ к состоянию
  console.log(store.state);

  // Вызов actions
  store.open();
};
```

## ⌨️ Keyboard Navigation

| Клавиша     | Действие                     |
| ----------- | ---------------------------- |
| `/`         | Открыть меню                 |
| `↑`         | Предыдущий элемент           |
| `↓`         | Следующий элемент            |
| `Enter`     | Выбрать элемент              |
| `Escape`    | Закрыть меню                 |
| `Backspace` | Закрыть если курсор в начале |

## 🔧 Как это работает

1. **Обнаружение slash команды**: Hook слушает события клавиатуры и обнаруживает нажатие `/` в начале пустого блока.

2. **Получение позиции курсора**: Используется `window.getSelection()` и `getRangeAt(0)` для получения позиции текстового курсора.

3. **Floating UI**: Используется `inline()` middleware для позиционирования относительно текстового курсора (который может находиться на нескольких строках).

4. **Фильтрация**: При вводе текста после `/` список блоков фильтруется в реальном времени.

5. **Выбор блока**: При клике или нажатии Enter вызывается `editor.toggleBlock(type, { deleteText: true })`, который:
   - Удаляет введенный текст (включая `/`)
   - Превращает текущий блок в выбранный тип

## 🆚 Отличия от ActionMenuList

| Характеристика  | SlashActionMenuList   | ActionMenuList         |
| --------------- | --------------------- | ---------------------- |
| **Триггер**     | Автоматический (`/`)  | Программный (`open()`) |
| **Positioning** | Inline (курсор)       | Button (элемент)       |
| **View**        | Default (большой)     | Small/Default          |
| **deleteText**  | ✅ Да                 | ❌ Нет                 |
| **Middleware**  | inline + flip + shift | flip + shift           |
| **Use case**    | Slash команда         | Button меню            |

## 📝 Примеры

### Кастомный триггер

```tsx
const { actions, ... } = useSlashActionMenu({ trigger: '@' });
```

### Программное открытие (не рекомендуется)

```tsx
const store = useSlashActionMenuStore();

// Открыть меню
store.open(referenceElement);

// Закрыть меню
store.close();
```

## 🎯 Best Practices

1. **Используйте hook только один раз** - не создавайте несколько экземпляров `useSlashActionMenu`
2. **Проверяйте `isMounted`** - рендерите только если `isMounted === true`
3. **Передавайте props** - используйте `getItemProps` и `getRootProps` для правильной работы
4. **Не модифицируйте store напрямую** - используйте hook API

## 🐛 Troubleshooting

### Меню не открывается

- Убедитесь, что курсор находится в начале пустого блока
- Проверьте, что `readOnly={false}` в YooptaEditor
- Проверьте, что компонент рендерится внутри YooptaEditor

### Неправильное позиционирование

- Убедитесь, что используется `{...getRootProps()}` на `Content`
- Проверьте, что нет конфликтующих CSS правил
- Убедитесь, что структура компонентов правильная: Root → Content → Group → Item

### Стили не применяются

- Проверьте, что импортирован CSS: `import '@yoopta/ui/slash-action-menu-list'`
- Проверьте, что определены CSS переменные `--yoopta-ui-*`
- Проверьте, что классы имеют префикс `yoopta-ui-`

## 📚 См. также

- [ActionMenuList](../action-menu-list/README.md) - для button меню
- [Toolbar](../toolbar/README.md) - для toolbar
- [BlockOptions](../block-options/README.md) - для block options
