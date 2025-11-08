# ActionMenuList

A flexible and customizable action menu list component for Yoopta Editor, built with Zustand for state management and styled with shadcn/ui principles.

## Features

- 🎯 **Keyboard Navigation** - Full keyboard support (Arrow keys, Enter, Escape, Tab)
- 🔍 **Search & Filter** - Real-time filtering with support for aliases and shortcuts
- 🎨 **Customizable** - Compound component pattern with full styling control
- ⚡ **Performance** - Optimized with Zustand for state management
- 🎭 **Smooth Animations** - Built-in transitions using Floating UI
- 📱 **Responsive** - Adapts to different view modes (default/small)

## Architecture

### Store (`store.ts`)

Manages the action menu state using Zustand:

- `state`: 'open' | 'closed'
- `searchText`: Current search query
- `selectedIndex`: Currently selected item index
- `styles`: Floating UI styles

### Hook (`hooks.ts`)

`useActionMenuList` - Main hook that:

- Handles keyboard navigation
- Manages filtering and search
- Integrates with Floating UI for positioning
- Provides smooth transitions

### Component (`action-menu-list.tsx`)

Compound component with subcomponents:

- `ActionMenuList.Root` - Container with portal
- `ActionMenuList.Content` - Scrollable content wrapper
- `ActionMenuList.Group` - Group items together
- `ActionMenuList.Item` - Individual action item
- `ActionMenuList.Empty` - Empty state message

## Usage

### Basic Example

```tsx
import { ActionMenuList, useActionMenuList } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';

const ActionMenuComponent = () => {
  const editor = useYooptaEditor();
  const { actions, selectedAction, empty, getItemProps, getRootProps } = useActionMenuList();

  return (
    <ActionMenuList.Root>
      <ActionMenuList.Content>
        <ActionMenuList.Group {...getRootProps()}>
          {empty ? (
            <ActionMenuList.Empty />
          ) : (
            actions.map((action) => (
              <ActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === selectedAction?.type}
                {...getItemProps(action.type)}
              />
            ))
          )}
        </ActionMenuList.Group>
      </ActionMenuList.Content>
    </ActionMenuList.Root>
  );
};
```

### Programmatic Opening

You can programmatically open the menu with custom reference and view:

```tsx
const { open, close } = useActionMenuList();

// Open with custom reference and small view
const handleTurnInto = () => {
  const buttonElement = document.querySelector('.my-button');
  open({ reference: buttonElement as HTMLElement, view: 'small' });
};

// Open with default view
const handleOpenMenu = () => {
  open();
};

// Close menu
const handleClose = () => {
  close();
};
```

### With Custom Items

```tsx
const customItems = [
  {
    type: 'Paragraph',
    title: 'Text',
    description: 'Just start writing with plain text',
    icon: <TextIcon />,
  },
  {
    type: 'HeadingOne',
    title: 'Heading 1',
    description: 'Big section heading',
    icon: <H1Icon />,
  },
];

<ActionMenuList.Root items={customItems}>{/* ... */}</ActionMenuList.Root>;
```

### Custom Render Function

```tsx
<ActionMenuList.Root
  render={({ actions, selectedAction, getItemProps, getRootProps, empty }) => (
    <div className="custom-menu">
      <div {...getRootProps()}>
        {empty ? (
          <div>No results found</div>
        ) : (
          actions.map((action) => (
            <button
              key={action.type}
              {...getItemProps(action.type)}
              className={action.type === selectedAction?.type ? 'active' : ''}>
              {action.title}
            </button>
          ))
        )}
      </div>
    </div>
  )}
/>
```

### Different View Modes

```tsx
// Small view (compact)
<ActionMenuList.Root view="small">
  <ActionMenuList.Content view="small">
    {/* Items will be rendered in compact mode */}
  </ActionMenuList.Content>
</ActionMenuList.Root>

// Default view (full)
<ActionMenuList.Root view="default">
  <ActionMenuList.Content view="default">
    {/* Items with descriptions */}
  </ActionMenuList.Content>
</ActionMenuList.Root>
```

### Mode: Create vs Toggle

```tsx
// Create mode - deletes trigger text and inserts new block
<ActionMenuList.Root mode="create" />

// Toggle mode - converts current block to selected type
<ActionMenuList.Root mode="toggle" />
```

## Props

### ActionMenuList.Root

| Prop      | Type                           | Default           | Description             |
| --------- | ------------------------------ | ----------------- | ----------------------- |
| `items`   | `ActionMenuItem[] \| string[]` | All editor blocks | Custom items to display |
| `trigger` | `string`                       | `'/'`             | Trigger character       |
| `view`    | `'small' \| 'default'`         | `'default'`       | Display mode            |
| `mode`    | `'create' \| 'toggle'`         | `'create'`        | Behavior mode           |
| `render`  | `(props) => JSX.Element`       | -                 | Custom render function  |

### ActionMenuList.Content

| Prop   | Type                   | Default     | Description  |
| ------ | ---------------------- | ----------- | ------------ |
| `view` | `'small' \| 'default'` | `'default'` | Display mode |

### ActionMenuList.Item

| Prop       | Type                   | Default     | Description              |
| ---------- | ---------------------- | ----------- | ------------------------ |
| `action`   | `ActionMenuItem`       | -           | Action item data         |
| `view`     | `'small' \| 'default'` | `'default'` | Display mode             |
| `selected` | `boolean`              | `false`     | Whether item is selected |

## Keyboard Shortcuts

- `/` - Open action menu
- `↑` / `↓` - Navigate items
- `Enter` - Select item
- `Escape` - Close menu
- `Backspace` - Close if at start
- `Tab` - Prevent default (reserved)

## Styling

### CSS Variables

```css
:root {
  /* Z-index */
  --yoopta-ui-action-menu-z-index: 9999;

  /* Border radius */
  --yoopta-ui-action-menu-radius: 0.5rem;
  --yoopta-ui-action-menu-item-radius: 0.375rem;
  --yoopta-ui-action-menu-icon-radius: 0.375rem;

  /* Spacing */
  --yoopta-ui-action-menu-padding: 0.5rem;
  --yoopta-ui-action-menu-item-padding: 0.5rem;
  --yoopta-ui-action-menu-item-gap: 0.5rem;
  --yoopta-ui-action-menu-empty-padding: 0.5rem;

  /* Sizes */
  --yoopta-ui-action-menu-max-height: 330px;

  /* Typography */
  --yoopta-ui-action-menu-item-font-size: 0.875rem;
  --yoopta-ui-action-menu-item-description-font-size: 0.75rem;
  --yoopta-ui-action-menu-empty-font-size: 0.75rem;

  /* Shadow */
  --yoopta-ui-action-menu-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
```

### Custom Classes

```tsx
<ActionMenuList.Root className="my-custom-menu">
  <ActionMenuList.Content className="my-custom-content">
    <ActionMenuList.Item action={action} className="my-custom-item" />
  </ActionMenuList.Content>
</ActionMenuList.Root>
```

## Hook API

The `useActionMenuList` hook returns the following:

```typescript
{
  // State
  state: 'open' | 'closed';
  isMounted: boolean;
  empty: boolean;

  // Data
  actions: ActionMenuItem[];
  selectedAction?: ActionMenuItem;
  view: 'small' | 'default';
  mode: 'create' | 'toggle';

  // Methods
  open: (options?: { reference?: HTMLElement | null; view?: 'small' | 'default' }) => void;
  onClose: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;

  // Props builders
  getItemProps: (type: string) => any;
  getRootProps: () => any;

  // Floating UI
  setFloating: (node: HTMLElement | null) => void;
  styles: CSSProperties;
}
```

### `open(options?)`

Programmatically open the menu with optional configuration:

- `reference?: HTMLElement | null` - Custom reference element for positioning
- `view?: 'small' | 'default'` - Display mode

**Example**:

```tsx
const { open } = useActionMenuList();

// Open with custom reference and small view
open({ reference: buttonElement, view: 'small' });

// Open with default settings
open();
```

## Store API

Access the store directly for advanced use cases:

```tsx
import { useActionMenuListStore } from '@yoopta/ui';

const store = useActionMenuListStore();

// Open/close
store.open();
store.close();

// Search
store.setSearchText('heading');

// Selection
store.setSelectedIndex(2);

// Reset
store.reset();
```

## Types

```typescript
type ActionMenuItem = {
  type: string;
  title: string;
  description?: string;
  icon?: string | ReactNode | ReactElement;
};

type ActionMenuListState = 'open' | 'closed';

type ActionMenuRenderProps = {
  actions: ActionMenuItem[];
  editor: YooEditor;
  selectedAction?: ActionMenuItem;
  onClose: () => void;
  getItemProps: (type: string) => any;
  getRootProps: () => any;
  empty: boolean;
  view?: 'small' | 'default';
  mode?: 'create' | 'toggle';
};
```

## Integration with YooptaEditor

```tsx
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { ActionMenuList } from '@yoopta/ui';

const Editor = () => {
  const editor = useMemo(() => createYooptaEditor(), []);

  return (
    <YooptaEditor editor={editor} plugins={plugins}>
      <ActionMenuComponent />
    </YooptaEditor>
  );
};
```

## Best Practices

1. **Use compound components** for maximum flexibility
2. **Leverage CSS variables** for consistent theming
3. **Keep custom items minimal** for better performance
4. **Use view modes** appropriately (small for toolbars, default for main menu)
5. **Test keyboard navigation** thoroughly

## Performance Tips

- The component uses Zustand for efficient state management
- Filtering is optimized with memoization
- Floating UI handles positioning efficiently
- Transitions are GPU-accelerated

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Semantic HTML structure
