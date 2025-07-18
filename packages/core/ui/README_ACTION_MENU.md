# ActionMenu Component

Современный компонент для отображения меню действий в Yoopta Editor, построенный с использованием composition pattern и custom hooks.

## Архитектура

### 🏗️ Структура компонентов

```
ActionMenu/
├── ActionMenu.tsx          # UI компоненты (Root, Content, List, Item, Empty)
├── ActionMenuContext.tsx   # Контекст для управления состоянием
├── useActionMenu.ts        # Хук с основной логикой
├── action-menu.css         # Стили компонента
└── index.ts               # Экспорты
```

### 🎯 Принципы дизайна

1. **Separation of Concerns**: UI компоненты отделены от логики
2. **Composition Pattern**: Гибкая композиция компонентов
3. **Custom Hooks**: Переиспользуемая логика
4. **Context API**: Управление состоянием

## Использование

### Базовое использование

```tsx
import { ActionMenu, ActionMenuProvider, useActionMenu } from '@yoopta/ui';

const MyActionMenu = () => {
  const editor = useYooptaEditor();

  const { actions, selectedAction, empty, onSelect, onNavigate, onConfirm, onMouseEnter } = useActionMenu({
    editor,
    trigger: '/',
    mode: 'create',
  });

  return (
    <ActionMenuProvider>
      <ActionMenu.Root>
        <ActionMenu.Content>
          <ActionMenu.List>
            {empty ? (
              <ActionMenu.Empty />
            ) : (
              actions.map((action) => (
                <ActionMenu.Item
                  key={action.type}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  selected={selectedAction?.type === action.type}
                  onClick={() => onSelect(action.type)}
                  onMouseEnter={() => onMouseEnter(action.type)}
                />
              ))
            )}
          </ActionMenu.List>
        </ActionMenu.Content>
      </ActionMenu.Root>
    </ActionMenuProvider>
  );
};
```

### Готовый компонент

```tsx
import { ActionMenu, ActionMenuProvider } from '@/new-components/action-menu/action-menu';

const Editor = () => {
  return (
    <ActionMenuProvider>
      <YooptaEditor>
        <ActionMenu />
      </YooptaEditor>
    </ActionMenuProvider>
  );
};
```

## API

### ActionMenuProvider

Провайдер для управления состоянием ActionMenu.

```tsx
<ActionMenuProvider>{/* ActionMenu компоненты */}</ActionMenuProvider>
```

### ActionMenu.Root

Основной контейнер компонента.

```tsx
<ActionMenu.Root className?: string>
  {/* ActionMenu content */}
</ActionMenu.Root>
```

### ActionMenu.Content

Контейнер с прокруткой.

```tsx
<ActionMenu.Content className?: string>
  {/* ActionMenu list */}
</ActionMenu.Content>
```

### ActionMenu.List

Список элементов.

```tsx
<ActionMenu.List className?: string>
  {/* ActionMenu items */}
</ActionMenu.List>
```

### ActionMenu.Item

Элемент меню.

```tsx
<ActionMenu.Item
  icon?: React.ReactNode
  title: string
  description?: string
  selected?: boolean
  variant?: 'default' | 'small'
  onClick?: () => void
  onMouseEnter?: () => void
  className?: string
/>
```

### ActionMenu.Empty

Состояние пустого списка.

```tsx
<ActionMenu.Empty className?: string>
  Custom empty message
</ActionMenu.Empty>
```

## Hooks

### useActionMenu

Основной хук для управления логикой ActionMenu.

```tsx
const {
  actions, // Список доступных действий
  selectedAction, // Выбранное действие
  empty, // Пустой ли список
  onFilter, // Фильтрация по тексту
  onSelect, // Выбор действия
  onNavigate, // Навигация (up/down)
  onConfirm, // Подтверждение выбора
  onMouseEnter, // Hover на элемент
} = useActionMenu({
  editor, // Экземпляр YooEditor
  items, // Список типов блоков
  trigger, // Триггер (по умолчанию '/')
  mode, // Режим (create/toggle)
});
```

### useActionMenuContext

Хук для доступа к контексту ActionMenu.

```tsx
const { isOpen, style, setFloatingRef, open, close } = useActionMenuContext();
```

## Типы

### ActionMenuItem

```tsx
interface ActionMenuItem {
  type: string;
  title: string;
  description?: string;
  icon?: string | React.ReactNode | React.ReactElement;
}
```

### UseActionMenuOptions

```tsx
interface UseActionMenuOptions {
  editor: YooEditor;
  items?: string[];
  trigger?: string;
  mode?: 'create' | 'toggle';
}
```

### UseActionMenuReturn

```tsx
interface UseActionMenuReturn {
  actions: ActionMenuItem[];
  selectedAction: ActionMenuItem | null;
  empty: boolean;
  onFilter: (text: string) => void;
  onSelect: (type: string) => void;
  onNavigate: (direction: 'up' | 'down') => void;
  onConfirm: () => void;
  onMouseEnter: (type: string) => void;
}
```

## Функциональность

### 🎯 Автоматическое открытие

- Открывается при вводе триггера (по умолчанию '/')
- Позиционируется относительно курсора
- Автоматически закрывается при потере фокуса

### 🔍 Фильтрация

- Поиск по названию блока
- Поиск по описанию
- Поиск по алиасам
- Поиск по горячим клавишам

### ⌨️ Навигация

- Стрелки вверх/вниз для навигации
- Enter для подтверждения
- Escape для закрытия
- Мышь для выбора

### 🎨 Кастомизация

- Поддержка кастомных иконок
- Варианты размера (default/small)
- Кастомные стили через className
- Гибкая композиция компонентов

## Стили и темы

### Поддержка темной темы

ActionMenu поддерживает автоматическое переключение темной темы:

- **Автоматическое определение**: Следует системным настройкам `prefers-color-scheme`
- **Принудительная тема**: Поддерживает `[data-theme="dark"]` и `[data-theme="light"]`
- **CSS переменные**: Все цвета определены через CSS переменные

### CSS переменные

#### Светлая тема

```css
--yoopta-ui-action-menu-bg: hsl(0 0% 100%);
--yoopta-ui-action-menu-border: hsl(214.3 31.8% 91.4%);
--yoopta-ui-action-menu-text: hsl(222.2 84% 4.9%);
--yoopta-ui-action-menu-hover-bg: hsl(210 40% 98%);
--yoopta-ui-action-menu-selected-bg: hsl(210 40% 96%);
--yoopta-ui-action-menu-icon-bg: hsl(0 0% 100%);
--yoopta-ui-action-menu-icon-border: hsl(214.3 31.8% 91.4%);
--yoopta-ui-action-menu-description: hsl(215.4 16.3% 46.9%);
--yoopta-ui-action-menu-empty: hsl(215.4 16.3% 46.9%);
```

#### Темная тема

```css
--yoopta-ui-action-menu-bg: hsl(222.2 84% 4.9%);
--yoopta-ui-action-menu-border: hsl(217.2 32.6% 17.5%);
--yoopta-ui-action-menu-text: hsl(210 40% 98%);
--yoopta-ui-action-menu-hover-bg: hsl(217.2 32.6% 17.5%);
--yoopta-ui-action-menu-selected-bg: hsl(215.4 16.3% 46.9%);
--yoopta-ui-action-menu-icon-bg: hsl(222.2 84% 4.9%);
--yoopta-ui-action-menu-icon-border: hsl(217.2 32.6% 17.5%);
--yoopta-ui-action-menu-description: hsl(215.4 16.3% 46.9%);
--yoopta-ui-action-menu-empty: hsl(215.4 16.3% 46.9%);
```

### CSS классы

Компонент использует CSS классы с префиксом `yoo-action-menu-`:

- `.yoo-action-menu-root` - основной контейнер
- `.yoo-action-menu-content` - контейнер с прокруткой
- `.yoo-action-menu-list` - список элементов
- `.yoo-action-menu-item` - элемент меню
- `.yoo-action-menu-item-selected` - выбранный элемент
- `.yoo-action-menu-icon-wrapper` - контейнер иконки
- `.yoo-action-menu-item-content` - контент элемента
- `.yoo-action-menu-item-title` - заголовок
- `.yoo-action-menu-item-description` - описание
- `.yoo-action-menu-empty` - пустое состояние

### Анимации

- **Появление**: Плавная анимация `actionMenuFadeIn` с `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover эффекты**: Плавные переходы для всех интерактивных элементов
- **Backdrop blur**: Размытие фона для современного вида

## Преимущества новой архитектуры

### ✅ Разделение ответственности

- **UI компоненты**: Только отображение
- **Хуки**: Логика и состояние
- **Контекст**: Управление состоянием

### ✅ Переиспользование

- Логика может использоваться в разных UI
- UI компоненты могут использоваться с разной логикой
- Хуки можно комбинировать

### ✅ Тестируемость

- Логика изолирована в хуках
- UI компоненты легко тестировать
- Мокирование контекста

### ✅ Расширяемость

- Легко добавлять новые функции
- Гибкая композиция
- Кастомизация через пропы

### ✅ Типизация

- Полная поддержка TypeScript
- Строгая типизация всех интерфейсов
- Автодополнение в IDE
