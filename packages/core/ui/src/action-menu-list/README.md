# ActionMenuList

A controlled menu component for displaying and selecting block types. Perfect for "Turn into" buttons in toolbars and block options.

## Features

- 🎮 **Controlled** - Full control over open/close state
- 🎯 **Programmatic API** - Open from anywhere with `open()` function
- 🎨 **Flexible positioning** - Customizable placement via Floating UI
- 📦 **Compound Components** - Composable UI structure
- ⌨️ **Keyboard Navigation** - Built-in arrow key and hover support
- 🎭 **Two Views** - `small` and `default` sizes

## Installation

```bash
yarn add @yoopta/ui
```

## Basic Usage

### Simple Example

```tsx
import { ActionMenuList, useActionMenuList, useActionMenuListActions } from '@yoopta/ui';

// Component that renders the menu
const MyActionMenuList = () => {
  const { actions, selectedAction, empty, isOpen, getItemProps, getRootProps } =
    useActionMenuList();

  if (!isOpen) return null;

  return (
    <ActionMenuList.Root {...getRootProps()}>
      <ActionMenuList.Group>
        {empty ? (
          <ActionMenuList.Empty />
        ) : (
          actions.map((action) => (
            <ActionMenuList.Item
              key={action.type}
              action={action}
              selected={action.type === selectedAction?.type}
              icon={<MyIcon />}
              {...getItemProps(action.type)}
            />
          ))
        )}
      </ActionMenuList.Group>
    </ActionMenuList.Root>
  );
};

// Component that opens the menu
const MyToolbar = () => {
  const { open } = useActionMenuListActions();

  const onTurnIntoClick = (e: React.MouseEvent) => {
    open({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'bottom-start',
    });
  };

  return <button onClick={onTurnIntoClick}>Turn into</button>;
};

// Usage
<YooptaEditor>
  <MyToolbar />
  <MyActionMenuList />
</YooptaEditor>;
```

## API Reference

### Hooks

#### `useActionMenuList(options?)`

Full hook with Floating UI and all logic. Use this only in the component that renders the menu.

**Options:**

```typescript
{
  items?: string[];  // Array of block type names. Defaults to all editor blocks
  view?: 'small' | 'default';  // Default: 'default'
}
```

**Returns:**

```typescript
{
  isOpen: boolean;                    // Whether menu is mounted and visible
  state: 'open' | 'closed';          // Current state
  actions: ActionMenuItem[];          // Filtered block types
  selectedAction: ActionMenuItem | null;  // Currently selected item
  empty: boolean;                     // Whether actions array is empty
  view: 'small' | 'default';         // Current view mode
  open: (options: OpenOptions) => void;  // Open menu programmatically
  close: () => void;                  // Close menu
  getItemProps: (type: string) => ItemProps;  // Props for menu items
  getRootProps: () => RootProps;      // Props for root container
}
```

**OpenOptions:**

```typescript
{
  reference: HTMLElement | null;     // Required: Element to position relative to
  view?: 'small' | 'default';        // Optional: Override view mode
  placement?: Placement;              // Optional: Floating UI placement
}
```

#### `useActionMenuListActions()`

Lightweight hook for accessing only store actions. Use this when you only need to open/close the menu programmatically without rendering it.

**Returns:**

```typescript
{
  open: (options: OpenOptions) => void;
  close: () => void;
  toggle: (state: 'open' | 'closed') => void;
  isOpen: boolean;
}
```

### Components

#### `ActionMenuList.Root`

Root container for the menu. Handles positioning and visibility.

**Props:**

```typescript
{
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  ...HTMLAttributes<HTMLDivElement>
}
```

**Usage:**

```tsx
<ActionMenuList.Root {...getRootProps()}>{children}</ActionMenuList.Root>
```

#### `ActionMenuList.Group`

Groups menu items together.

**Props:**

```typescript
{
  children: ReactNode;
  className?: string;
  ...HTMLAttributes<HTMLDivElement>
}
```

**Usage:**

```tsx
<ActionMenuList.Group>
  <ActionMenuList.Item ... />
  <ActionMenuList.Item ... />
</ActionMenuList.Group>
```

#### `ActionMenuList.Item`

Individual menu item representing a block type.

**Props:**

```typescript
{
  action: ActionMenuItem;     // Required: Block type info
  selected?: boolean;         // Whether item is selected
  icon?: string | ReactNode;  // Optional: Icon to display
  className?: string;
  ...HTMLAttributes<HTMLButtonElement>
}
```

**ActionMenuItem:**

```typescript
{
  type: string;           // Block type name
  title: string;          // Display title
  description?: string;   // Optional description
  icon?: ReactNode;       // Optional icon
}
```

**Usage:**

```tsx
<ActionMenuList.Item
  action={action}
  selected={action.type === selectedAction?.type}
  icon={<MyIcon />}
  {...getItemProps(action.type)}
/>
```

#### `ActionMenuList.Empty`

Displays when no items are available.

**Props:**

```typescript
{
  children?: ReactNode;  // Custom empty message
  className?: string;
  ...HTMLAttributes<HTMLDivElement>
}
```

**Usage:**

```tsx
<ActionMenuList.Empty>No blocks available</ActionMenuList.Empty>
```

## Examples

### From Toolbar

```tsx
import {
  Toolbar,
  useToolbar,
  ActionMenuList,
  useActionMenuList,
  useActionMenuListActions,
} from '@yoopta/ui';

const MyToolbar = () => {
  const { isOpen, getRootProps } = useToolbar();
  const { open: openActionMenu } = useActionMenuListActions();

  const onTurnIntoClick = (e: React.MouseEvent) => {
    openActionMenu({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'bottom-start',
    });
  };

  if (!isOpen) return null;

  return (
    <Toolbar.Root {...getRootProps()}>
      <Toolbar.Button onClick={onTurnIntoClick}>Turn into</Toolbar.Button>
    </Toolbar.Root>
  );
};

const MyActionMenuList = () => {
  const { actions, selectedAction, isOpen, getItemProps, getRootProps } = useActionMenuList();

  if (!isOpen) return null;

  return (
    <ActionMenuList.Root {...getRootProps()}>
      <ActionMenuList.Group>
        {actions.map((action) => (
          <ActionMenuList.Item
            key={action.type}
            action={action}
            selected={action.type === selectedAction?.type}
            {...getItemProps(action.type)}
          />
        ))}
      </ActionMenuList.Group>
    </ActionMenuList.Root>
  );
};

// Usage
<YooptaEditor>
  <MyToolbar />
  <MyActionMenuList />
</YooptaEditor>;
```

### From BlockOptions

```tsx
import {
  BlockOptions,
  useBlockOptions,
  ActionMenuList,
  useActionMenuListActions,
} from '@yoopta/ui';

const MyBlockOptions = () => {
  const { isOpen, getRootProps } = useBlockOptions();
  const { open: openActionMenu } = useActionMenuListActions();

  const onTurnIntoClick = (e: React.MouseEvent) => {
    openActionMenu({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'right', // Open to the right of BlockOptions
    });
  };

  if (!isOpen) return null;

  return (
    <BlockOptions.Root {...getRootProps()}>
      <BlockOptions.Group>
        <BlockOptions.Button onClick={onTurnIntoClick}>Turn into</BlockOptions.Button>
      </BlockOptions.Group>
    </BlockOptions.Root>
  );
};

// MyActionMenuList component same as above

// Usage
<YooptaEditor>
  <MyBlockOptions />
  <MyActionMenuList />
</YooptaEditor>;
```

### Custom Items

```tsx
const MyActionMenuList = () => {
  const { actions, selectedAction, isOpen, getItemProps, getRootProps } = useActionMenuList({
    items: ['Paragraph', 'HeadingOne', 'HeadingTwo'], // Only these types
  });

  if (!isOpen) return null;

  return (
    <ActionMenuList.Root {...getRootProps()}>
      <ActionMenuList.Group>
        {actions.map((action) => (
          <ActionMenuList.Item
            key={action.type}
            action={action}
            selected={action.type === selectedAction?.type}
            icon={<CustomIcon type={action.type} />}
            {...getItemProps(action.type)}
          />
        ))}
      </ActionMenuList.Group>
    </ActionMenuList.Root>
  );
};
```

### Different Views

```tsx
// Small view (compact)
const onTurnIntoClick = (e: React.MouseEvent) => {
  open({
    reference: e.currentTarget as HTMLElement,
    view: 'small', // Compact view without descriptions
  });
};

// Default view (full)
const onTurnIntoClick = (e: React.MouseEvent) => {
  open({
    reference: e.currentTarget as HTMLElement,
    view: 'default', // Full view with descriptions
  });
};
```

### Custom Placement

```tsx
const onTurnIntoClick = (e: React.MouseEvent) => {
  open({
    reference: e.currentTarget as HTMLElement,
    placement: 'right', // or 'left', 'top', 'bottom', etc.
  });
};
```

## Styling

The component uses CSS variables for theming. See the main UI package documentation for available variables.

### CSS Classes

- `.yoopta-ui-action-menu-list-content` - Root container
- `.yoopta-ui-action-menu-list-group` - Group container
- `.yoopta-ui-action-menu-list-item` - Menu item button
- `.yoopta-ui-action-menu-list-item.selected` - Selected item
- `.yoopta-ui-action-menu-list-item-icon` - Icon container
- `.yoopta-ui-action-menu-list-item-content` - Text content container
- `.yoopta-ui-action-menu-list-item-title` - Item title
- `.yoopta-ui-action-menu-list-item-description` - Item description
- `.yoopta-ui-action-menu-list-empty` - Empty state

## Architecture

### Store-Based Coordination

`ActionMenuList` uses Zustand for state management, allowing different components to coordinate:

1. **Toolbar** calls `open()` → Store updates
2. **ActionMenuList** reads from store → Renders menu
3. User selects item → Menu calls `close()` → Store updates
4. **ActionMenuList** reads from store → Unmounts

This allows clean separation between components that trigger the menu and the menu itself.

### Two-Hook Pattern

- **`useActionMenuList()`**: Full hook with Floating UI, event listeners, and rendering logic. Use in the component that renders the menu.
- **`useActionMenuListActions()`**: Lightweight hook with only actions. Use in components that need to open/close the menu.

This pattern prevents unnecessary re-renders and keeps the API clean.

## Differences from SlashActionMenuList

| Feature         | ActionMenuList              | SlashActionMenuList       |
| --------------- | --------------------------- | ------------------------- |
| **Trigger**     | Programmatic (button click) | Automatic (slash command) |
| **Control**     | Controlled via `open()`     | Self-managed              |
| **Positioning** | Relative to button          | Relative to text cursor   |
| **Use Case**    | Toolbars, menus             | Slash commands            |
| **Filtering**   | No search                   | Search by text            |

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ActionMenuItem,
  ActionMenuListProps,
  ActionMenuListRootProps,
  ActionMenuListGroupProps,
  ActionMenuListItemProps,
  ActionMenuListEmptyProps,
} from '@yoopta/ui';
```

## Related Components

- **SlashActionMenuList** - For slash command menus
- **Toolbar** - Text formatting toolbar
- **BlockOptions** - Block action menu
- **FloatingBlockActions** - Floating block controls
