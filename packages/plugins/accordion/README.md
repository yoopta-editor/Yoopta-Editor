# @yoopta/accordion

Accordion plugin for Yoopta Editor with **fully headless architecture** and multiple UI themes.

## Installation

```bash
npm install @yoopta/accordion
# or
yarn add @yoopta/accordion
```

## Quick Start

```typescript
import Accordion from '@yoopta/accordion';
import AccordionElements from '@yoopta/accordion/ui/base';

const plugins = [
  Accordion.extend({
    elements: AccordionElements,
  }),
];
```

## Headless Architecture

The Accordion plugin follows a **headless architecture**, separating logic from UI rendering:

- **Headless Core** (`@yoopta/accordion`) - Logic, commands, events (NO UI)
- **UI Themes** (`@yoopta/accordion/ui/*`) - Pre-built UI components

### Why Headless?

- ✅ **Flexibility** - Use any UI library or CSS framework
- ✅ **Customization** - Full control over styling and behavior
- ✅ **Tree-shaking** - Import only what you need
- ✅ **No conflicts** - No CSS prefix pollution

## Available UI Themes

### 1. Base (Vanilla CSS) ⭐ Recommended

Minimal styled components with vanilla CSS. No dependencies, no Tailwind.

```typescript
import Accordion from '@yoopta/accordion';
import AccordionElements from '@yoopta/accordion/ui/base';

Accordion.extend({
  elements: AccordionElements,
});
```

**Size:** ~5KB | **Dependencies:** None

[Read more →](./src/ui/base/README.md)

### 2. Base Tailwind (Coming soon)

Tailwind CSS version without prefixes.

```typescript
import Accordion from '@yoopta/accordion';
import AccordionElements from '@yoopta/accordion/ui/base-tw';
```

### 3. Shadcn ⭐ Premium

Beautiful, modern design with Shadcn UI components and glassmorphic effects.

```typescript
import Accordion from '@yoopta/accordion';
import AccordionElements from '@yoopta/accordion/ui/shadcn';

Accordion.extend({
  elements: AccordionElements,
});
```

**Size:** ~8KB | **Dependencies:** `lucide-react`, `tailwindcss`

**Features:**

- ✨ Glassmorphic design
- 🎭 Smooth animations
- 🎯 Hover micro-interactions
- 🌗 Dark mode support

[Read more →](./src/ui/shadcn/README.md)

### 4. Material UI (Coming soon)

Material Design styled components.

```typescript
import Accordion from '@yoopta/accordion';
import AccordionElements from '@yoopta/accordion/ui/material';
```

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

Check out examples in the [development workspace](../../development).

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
