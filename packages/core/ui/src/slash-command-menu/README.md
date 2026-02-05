# SlashCommand Menu for Yoopta Editor

Composable, accessible slash command menu for Yoopta Editor with floating-ui positioning and full keyboard navigation.

## Features

- 🎯 **Composable API** - Build your menu with flexible compound components
- ⌨️ **Full Keyboard Navigation** - Arrow keys with loop, Enter to select, Esc to close
- 🔍 **Smart Filtering** - Search by title, keywords, description with relevance scoring
- 📍 **Auto Positioning** - Uses floating-ui for smart viewport-aware placement
- ♿ **Accessible** - ARIA attributes, roles, keyboard support
- 🎨 **Customizable Styles** - CSS variables for theming, no Tailwind dependency
- 🔌 **Yoopta Integration** - Direct integration with Yoopta Editor API

## Installation

```bash
npm install @floating-ui/react
```

## File Structure

```
slash-command-menu/
├── index.ts                         # Main exports
├── types.ts                         # TypeScript types
├── constants.ts                     # Constants
├── slash-command.css                # CSS styles
├── context/
│   └── slash-command-context.tsx   # React context
├── hooks/
│   ├── useSlashCommand.ts           # Main hook with Yoopta integration
│   ├── useFilter.ts                 # Filtering logic
│   └── usePositioning.ts            # floating-ui positioning
└── components/
    ├── slash-command-root.tsx       # Provider component
    ├── slash-command-content.tsx    # Floating container
    ├── slash-command-input.tsx      # Search input
    ├── slash-command-list.tsx       # Scrollable list
    ├── slash-command-group.tsx      # Group with heading
    ├── slash-command-item.tsx       # Selectable item
    ├── slash-command-empty.tsx      # Empty state
    ├── slash-command-separator.tsx  # Divider
    ├── slash-command-footer.tsx     # Keyboard hints
    └── slash-command-loading.tsx    # Loading state
```

## Basic Usage

```tsx
import { SlashCommand, SlashCommandItem } from './slash-command';

const items: SlashCommandItem[] = [
  {
    id: 'Paragraph',
    title: 'Text',
    description: 'Just start writing with plain text.',
    icon: <TypeIcon />,
    keywords: ['paragraph', 'text'],
    group: 'basic',
  },
  {
    id: 'HeadingOne',
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: <Heading1Icon />,
    keywords: ['h1', 'title'],
    group: 'basic',
  },
  // ... more items
];

function Editor() {
  return (
    <YooptaEditor editor={editor}>
      <SlashCommand.Root items={items}>
        <SlashCommand.Content>
          <SlashCommand.Input />
          <SlashCommand.List>
            <SlashCommand.Empty>No blocks found</SlashCommand.Empty>
            {items.map((item) => (
              <SlashCommand.Item
                key={item.id}
                value={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </SlashCommand.List>
          <SlashCommand.Footer />
        </SlashCommand.Content>
      </SlashCommand.Root>
    </YooptaEditor>
  );
}
```

## Grouped Items

```tsx
<SlashCommand.Root items={items}>
  <SlashCommand.Content>
    <SlashCommand.Input />
    <SlashCommand.List>
      <SlashCommand.Empty>No blocks found</SlashCommand.Empty>

      <SlashCommand.Group heading="Basic Blocks">
        {basicItems.map((item) => (
          <SlashCommand.Item key={item.id} {...item} />
        ))}
      </SlashCommand.Group>

      <SlashCommand.Separator />

      <SlashCommand.Group heading="Advanced">
        {advancedItems.map((item) => (
          <SlashCommand.Item key={item.id} {...item} />
        ))}
      </SlashCommand.Group>
    </SlashCommand.List>
    <SlashCommand.Footer />
  </SlashCommand.Content>
</SlashCommand.Root>
```

## Custom Selection Handler

```tsx
<SlashCommand.Root
  items={items}
  onSelect={(item) => {
    console.log('Selected:', item.id);
    // Default behavior (editor.toggleBlock) also runs
  }}>
  {/* ... */}
</SlashCommand.Root>
```

## API Reference

### SlashCommand.Root

| Prop       | Type                 | Description                      |
| ---------- | -------------------- | -------------------------------- |
| `items`    | `SlashCommandItem[]` | Array of available commands      |
| `trigger`  | `string`             | Trigger character (default: `/`) |
| `onSelect` | `(item) => void`     | Callback when item selected      |

### SlashCommand.Item

| Prop          | Type         | Description                    |
| ------------- | ------------ | ------------------------------ |
| `value`       | `string`     | Unique identifier (block type) |
| `title`       | `string`     | Display title                  |
| `description` | `string`     | Description text               |
| `icon`        | `ReactNode`  | Icon element                   |
| `shortcut`    | `string[]`   | Keyboard shortcut display      |
| `disabled`    | `boolean`    | Disable selection              |
| `onSelect`    | `() => void` | Item-specific callback         |

### SlashCommandItem Type

```typescript
type SlashCommandItem = {
  id: string; // Block type / unique id
  title: string; // Display title
  description?: string; // Optional description
  icon?: ReactNode; // Optional icon
  keywords?: string[]; // Search keywords
  group?: string; // Group identifier
  disabled?: boolean; // Disable item
  onSelect?: () => void; // Custom handler
};
```

## Keyboard Shortcuts

| Key      | Action                          |
| -------- | ------------------------------- |
| `/`      | Open menu (at empty line start) |
| `↑`      | Previous item (loops to last)   |
| `↓`      | Next item (loops to first)      |
| `Enter`  | Select current item             |
| `Escape` | Close menu                      |
| `Tab`    | Prevented (keeps focus)         |

## CSS Customization

Override CSS variables for theming:

```css
.slash-command-root {
  --slash-command-bg: #ffffff;
  --slash-command-bg-hover: #f4f4f5;
  --slash-command-border: #e4e4e7;
  --slash-command-text: #18181b;
  --slash-command-text-muted: #71717a;
  --slash-command-accent: #3b82f6;
  --slash-command-border-radius: 12px;
}

/* Dark mode */
.dark .slash-command-root {
  --slash-command-bg: #18181b;
  --slash-command-bg-hover: #27272a;
  --slash-command-border: #3f3f46;
  --slash-command-text: #fafafa;
  --slash-command-text-muted: #a1a1aa;
}
```

## Hooks

### useSlashCommand

Main hook for building custom implementations:

```tsx
const {
  state, // { isOpen, search, selectedIndex, position }
  actionHandlers, // { open, close, setSearch, selectNext, selectPrevious, ... }
  filteredItems, // Items filtered by search
  groupedItems, // Items grouped by category (Map)
  isEmpty, // No results
  refs, // DOM refs
  floatingStyles, // Positioning styles
} = useSlashCommand({ items, trigger, onSelect });
```

### useFilter

Standalone filtering hook:

```tsx
const { filteredItems, groupedItems, isEmpty } = useFilter({
  items,
  search,
});
```

### useKeyboardNavigation

Standalone keyboard navigation:

```tsx
useKeyboardNavigation({
  isOpen,
  itemCount,
  selectedIndex,
  onSelectIndex,
  onExecute,
  onClose,
  loop: true,
});
```

## Dependencies

- `@floating-ui/react` - Positioning
- `@yoopta/editor` - Editor integration
- `slate` - Editor selection utilities
