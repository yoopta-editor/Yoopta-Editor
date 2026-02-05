# @yoopta/accordion

Accordion plugin for Yoopta Editor with **headless architecture**. Use as-is (headless) or attach theme UI from `@yoopta/themes-shadcn`.

## Installation

```bash
yarn add @yoopta/accordion
```

## Usage

Pass the plugin to `createYooptaEditor`. Do not pass `plugins` to `<YooptaEditor>`.

```tsx
import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Accordion from '@yoopta/accordion';

const plugins = [Accordion];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins, marks: [] }), []);
  return <YooptaEditor editor={editor} onChange={() => {}} />;
}
```

## Themed UI (Shadcn)

Apply theme to all plugins or only Accordion:

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';
const plugins = applyTheme([Paragraph, Accordion, /* ... */]);
```

Or extend a single plugin:

```tsx
import Accordion from '@yoopta/accordion';
import { AccordionUI } from '@yoopta/themes-shadcn/accordion';

const AccordionWithUI = Accordion.extend({ elements: AccordionUI });
const plugins = [AccordionWithUI];
```

## Headless architecture

- **Headless core** (`@yoopta/accordion`) — logic, commands, events (no UI)
- **Theme packages** (e.g. `@yoopta/themes-shadcn`) — pre-built styled elements

You can also build custom UI by extending with your own `elements` (see Custom UI below).

## Custom UI

Create your own UI components:

```typescript
import Accordion from '@yoopta/accordion';
import type { PluginElementRenderProps } from '@yoopta/editor';

const CustomAccordionList = (props: PluginElementRenderProps) => {
  return (
    <div {...props.attributes} className="my-custom-accordion">
      {props.children}
    </div>
  );
};

const CustomAccordionItem = (props: PluginElementRenderProps) => {
  return (
    <details {...props.attributes} className="my-custom-item">
      {props.children}
    </details>
  );
};

const plugins = [
  Accordion.extend({
    elements: {
      'accordion-list': { render: CustomAccordionList },
      'accordion-list-item': { render: CustomAccordionItem },
      'accordion-list-item-heading': { render: CustomAccordionHeading },
      'accordion-list-item-content': { render: CustomAccordionContent },
    },
  }),
];
```

## API

### Plugin Type

```typescript
type AccordionElementMap = {
  'accordion-list': AccordionListElement;
  'accordion-list-item': AccordionItemElement;
  'accordion-list-item-heading': AccordionListItemHeadingElement;
  'accordion-list-item-content': AccordionListItemContentElement;
};
```

### Commands

```typescript
import { AccordionCommands } from '@yoopta/accordion';
[TODO]
```

### Extend Options

```typescript
Accordion.extend({
  // Apply UI theme
  elements: AccordionElements,

  // Allow nested plugins (in heading and content)
  injectElementsFromPlugins: [Paragraph, Headings, Lists, Image],

  // Custom options
  options: {
    display: {
      title: 'Custom Accordion',
      description: 'My custom accordion',
    },
    shortcuts: ['accordion', 'collapse'],
  },

  // Custom events
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        // Custom keyboard handling
      };
    },
  },
});
```

## Styling

### With UI/Base

Override default styles:

```css
.yoopta-accordion-list {
  margin: 2rem 0;
}

.yoopta-accordion-list-item {
  background: #1a1a1a;
  border-radius: 0.5rem;
}
```

### With Custom CSS

```typescript
const plugins = [
  Accordion.extend({
    options: {
      HTMLAttributes: {
        className: 'my-accordion',
      },
    },
  }),
];
```

## Architecture

See [UI-ARCHITECTURE.md](./UI-ARCHITECTURE.md) for detailed information about:

- Headless plugin structure
- Creating new UI themes
- Best practices
- Styling strategies

## Examples

Check out the [development workspace](../../development) and [live playground](https://yoopta.dev/playground). See [Accordion plugin docs](https://docs.yoopta.dev/plugins/accordion).

## TypeScript

Full TypeScript support with type-safe element configurations.

```typescript
import type { AccordionElementMap } from '@yoopta/accordion';
import type { YooptaPlugin } from '@yoopta/editor';

const accordionPlugin: YooptaPlugin<AccordionElementMap> = Accordion.extend({
  // Type-safe configuration
});
```

## License

MIT

---

Made with ❤️ for [Yoopta Editor](https://github.com/Darginec05/Yoopta-Editor)
