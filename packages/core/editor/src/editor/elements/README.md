# Element Structure Builder API

Создавайте сложные структуры блоков с помощью `editor.h()` или JSX.

## Быстрый старт

### 1. Базовое использование

```typescript
// Создание простой структуры
editor.insertBlock('Accordion', {
  elements: editor.h('accordion-list', {
    children: [
      editor.h('accordion-list-item', {
        props: { isExpanded: false },
        children: [
          editor.h('accordion-list-item-heading'),
          editor.h('accordion-list-item-content'),
        ],
      }),
    ],
  }),
});
```

### 2. Использование с allowedPlugins

```typescript
// Вставка элементов из allowedPlugins внутрь контейнера
editor.insertBlock('Accordion', {
  elements: editor.h('accordion-list', {
    children: [
      editor.h('accordion-list-item', {
        children: [
          editor.h('accordion-list-item-heading'),
          editor.h('accordion-list-item-content', {
            // paragraph и heading-one из allowedPlugins
            children: [editor.h('paragraph'), editor.h('heading-one')],
          }),
        ],
      }),
    ],
  }),
});
```

### 3. JSX синтаксис

```typescript
import { Elements } from '@yoopta/editor';

const h = Elements.createJSXFactory(editor);

/** @jsx h */
const structure = (
  <accordion-list>
    <accordion-list-item props={{ isExpanded: false }}>
      <accordion-list-item-heading />
      <accordion-list-item-content>
        <paragraph />
        <heading-one />
      </accordion-list-item-content>
    </accordion-list-item>
  </accordion-list>
);

editor.insertBlock('Accordion', { elements: structure });
```

## API Reference

### `editor.h(type, options?)`

Создает структуру Slate элемента.

**Параметры:**

- `type: string` - Тип элемента (например, 'paragraph', 'accordion-list')
- `options?: ElementStructureOptions` - Опциональные настройки
  - `props?: Record<string, unknown>` - Кастомные props элемента
  - `children?: SlateElement[]` - Дочерние элементы

**Возвращает:** `SlateElement`

### `Elements.createJSXFactory(editor)`

Создает JSX-совместимую функцию для использования с pragma.

**Параметры:**

- `editor: YooEditor` - Экземпляр редактора

**Возвращает:** JSX-совместимую функцию `h`

## Примеры

Смотрите [подробные примеры](./createElementStructure.examples.md) для дополнительной информации.

## TypeScript

```typescript
import type { ElementStructureOptions, SlateElement } from '@yoopta/editor';
```

Полная типизация доступна из коробки.
