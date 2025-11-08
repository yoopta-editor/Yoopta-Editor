# @yoopta/ui Architecture

A collection of UI components for Yoopta Editor, built with Zustand for state management and styled with shadcn/ui principles.

## Overview

The `@yoopta/ui` package provides a set of modular, customizable UI components that integrate seamlessly with Yoopta Editor. Each component follows a consistent architecture pattern:

1. **Store** - Zustand store for state management
2. **Hook** - Business logic and integration with Floating UI
3. **Component** - Compound component with subcomponents
4. **Styles** - CSS with CSS variables for customization

## Components

### 1. FloatingBlockActions

**Purpose**: Floating action buttons that appear on hover next to blocks.

**Architecture**:

- **Store** (`floating-block-actions/store.ts`): Manages `state` ('hovering' | 'frozen' | 'closed'), `blockId`, `position`, `styles`, and `reference`
- **Hook** (`floating-block-actions/hooks.ts`): Handles mouse movement tracking, block detection, and positioning
- **Component** (`floating-block-actions/floating-block-actions.tsx`): Compound component with `Root` and `Button` subcomponents

**Key Features**:

- Hover detection with smooth transitions
- Frozen state when interacting with BlockOptions
- Automatic positioning relative to blocks

**Usage**:

```tsx
const { toggle, reference, floatingBlockId } = useFloatingBlockActions();

<FloatingBlockActions.Root>
  <FloatingBlockActions.Button onClick={onPlusClick}>
    <PlusIcon />
  </FloatingBlockActions.Button>
  <FloatingBlockActions.Button onClick={onDragClick}>
    <DragHandleIcon />
  </FloatingBlockActions.Button>
</FloatingBlockActions.Root>;
```

---

### 2. BlockOptions

**Purpose**: Context menu for block actions (duplicate, delete, copy link, etc.).

**Architecture**:

- **Store** (`block-options/store.ts`): Manages `state` ('open' | 'closed'), `blockId`, and `refs` (floating, reference)
- **Hook** (`block-options/hooks.ts`): Integrates with Floating UI for positioning, provides block actions
- **Component** (`block-options/block-options.tsx`): Compound component with `Root`, `Content`, `Group`, `Button`, and `Separator`

**Key Features**:

- Floating UI positioning with flip/shift middleware
- Smooth transitions with `useTransitionStyles`
- Block-specific actions (duplicate, delete, copy link)

**Usage**:

```tsx
const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();

<BlockOptions.Root onClose={onClose}>
  <BlockOptions.Content>
    <BlockOptions.Group>
      <BlockOptions.Button onClick={onDuplicateBlock}>Duplicate</BlockOptions.Button>
      <BlockOptions.Button onClick={onDeleteBlock}>Delete</BlockOptions.Button>
    </BlockOptions.Group>
  </BlockOptions.Content>
</BlockOptions.Root>;
```

---

### 3. Toolbar

**Purpose**: Floating toolbar for text formatting and alignment.

**Architecture**:

- **Store** (`toolbar/store.ts`): Manages `state` ('open' | 'closed'), `frozen`, and `styles`
- **Hook** (`toolbar/hooks.ts`): Tracks text/block selection, handles Floating UI positioning
- **Component** (`toolbar/toolbar.tsx`): Compound component with `Root`, `Group`, `Separator`, and `Button`

**Key Features**:

- Text selection tracking
- Block selection support
- Frozen state for toolbar interaction
- Smooth animations with `useTransitionStyles`

**Usage**:

```tsx
const editor = useYooptaEditor();

<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.Button onClick={editor.formats.bold?.toggle} active={isBoldActive}>
      <BoldIcon />
    </Toolbar.Button>
    <Toolbar.Button onClick={editor.formats.italic?.toggle} active={isItalicActive}>
      <ItalicIcon />
    </Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button onClick={onAlignLeft}>
      <AlignLeftIcon />
    </Toolbar.Button>
  </Toolbar.Group>
</Toolbar.Root>;
```

---

### 4. ActionMenuList

**Purpose**: Slash command menu for inserting/toggling blocks.

**Architecture**:

- **Store** (`action-menu-list/store.ts`): Manages `state` ('open' | 'closed'), `searchText`, `selectedIndex`, and `styles`
- **Hook** (`action-menu-list/hooks.ts`): Handles keyboard navigation, filtering, and slash command detection
- **Component** (`action-menu-list/action-menu-list.tsx`): Compound component with `Root`, `Content`, `Group`, `Item`, and `Empty`

**Key Features**:

- Slash command trigger (`/`)
- Real-time filtering with search
- Full keyboard navigation (Arrow keys, Enter, Escape)
- Support for custom items and render functions
- Two view modes: 'default' and 'small'
- Two behavior modes: 'create' and 'toggle'

**Usage**:

```tsx
const { actions, selectedAction, empty, getItemProps, getRootProps } = useActionMenuList();

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
</ActionMenuList.Root>;
```

---

## Design Patterns

### 1. Compound Components

All components use the compound component pattern for maximum flexibility:

```tsx
<Component.Root>
  <Component.Content>
    <Component.Group>
      <Component.Item />
    </Component.Group>
  </Component.Content>
</Component.Root>
```

**Benefits**:

- Flexible composition
- Clear component hierarchy
- Easy customization
- Type-safe props

### 2. Zustand for State Management

Each component has its own Zustand store:

```typescript
export const useComponentStore = create<ComponentStore>()((set, get) => ({
  state: 'closed',
  // ... other state

  open() {
    set({ state: 'open' });
  },

  close() {
    set({ state: 'closed' });
  },

  reset() {
    set({
      /* initial state */
    });
  },
}));
```

**Benefits**:

- Minimal re-renders
- Easy to test
- No prop drilling
- Shared state across components

### 3. Floating UI Integration

All floating components use `@floating-ui/react`:

```typescript
const { refs, floatingStyles, context } = useFloating({
  placement: 'top',
  open: state === 'open',
  middleware: [inline(), flip(), shift(), offset(10)],
  whileElementsMounted: autoUpdate,
});

const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
  duration: 100,
});
```

**Benefits**:

- Smart positioning
- Collision detection
- Smooth animations
- Accessibility

### 4. CSS Variables for Theming

All components use CSS variables for customization:

```css
.yoopta-ui-component {
  background: hsl(var(--yoopta-ui-background));
  border: 1px solid hsl(var(--yoopta-ui-border));
  border-radius: var(--yoopta-ui-component-radius, 0.5rem);
  padding: var(--yoopta-ui-component-padding, 0.5rem);
}
```

**Benefits**:

- Easy theming
- Consistent design
- No inline styles
- CSS-in-CSS approach

---

## File Structure

```
packages/core/ui/src/
├── floating-block-actions/
│   ├── store.ts                    # Zustand store
│   ├── hooks.ts                    # Business logic hook
│   ├── floating-block-actions.tsx  # Component
│   ├── floating-block-actions.css  # Styles
│   ├── index.tsx                   # Exports
│   ├── store.test.ts               # Unit tests
│   └── README.md                   # Documentation
├── block-options/
│   ├── store.ts
│   ├── hooks.ts
│   ├── block-options.tsx
│   ├── block-options.css
│   ├── index.ts
│   ├── store.test.ts
│   └── README.md
├── toolbar/
│   ├── store.ts
│   ├── hooks.ts
│   ├── toolbar.tsx
│   ├── toolbar.css
│   ├── index.ts
│   ├── store.test.ts
│   └── README.md
├── action-menu-list/
│   ├── store.ts
│   ├── hooks.ts
│   ├── types.ts                    # TypeScript types
│   ├── utils.ts                    # Helper functions
│   ├── action-menu-list.tsx
│   ├── action-menu-list.css
│   ├── index.ts
│   ├── store.test.ts
│   └── README.md
└── index.ts                        # Main entry point
```

---

## State Management Flow

### Example: FloatingBlockActions

1. **User hovers over a block**

   - `hooks.ts`: `handleMouseMove` detects hover
   - `store.ts`: `toggle('hovering', blockId)` updates state
   - `store.ts`: `updatePosition(top, left)` updates position and styles
   - Component re-renders with new styles

2. **User clicks drag handle**

   - `dev/index.tsx`: `onDragClick` calls `openBlockOptions`
   - `block-options/store.ts`: `toggle('open', reference, blockId)` opens BlockOptions
   - `floating-block-actions/store.ts`: `toggle('frozen', blockId)` freezes FloatingBlockActions

3. **User closes BlockOptions**
   - `block-options/store.ts`: `toggle('closed')` closes BlockOptions
   - `floating-block-actions/store.ts`: `toggle('hovering')` unfreezes FloatingBlockActions

---

## Testing Strategy

### Unit Tests (Vitest)

Each store has comprehensive unit tests:

```typescript
describe('ComponentStore', () => {
  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      // ...
    });
  });

  describe('Open/Close', () => {
    it('should open component', () => {
      // ...
    });
  });

  // ... more tests
});
```

**Coverage**:

- Initial state
- State transitions
- Edge cases
- Complex scenarios
- Integration flows

### E2E Tests (Playwright)

E2E tests simulate user interactions:

```typescript
test('FloatingBlockActions appears on hover', async ({ page }) => {
  await page.locator('[data-yoopta-block]').first().hover();
  const floatingBlockActions = page.locator('.yoopta-ui-floating-block-actions');
  await expect(floatingBlockActions).toBeVisible();
});
```

---

## Best Practices

### 1. Component Development

- **Use compound components** for flexibility
- **Keep stores minimal** - only essential state
- **Separate concerns** - store, hook, component
- **Write tests first** for new features

### 2. State Management

- **Avoid prop drilling** - use Zustand stores
- **Destructure selectively** - minimize re-renders
- **Use reset()** to clean up state
- **Keep actions simple** - one responsibility per action

### 3. Styling

- **Use CSS variables** for theming
- **Follow shadcn/ui patterns** for consistency
- **Avoid inline styles** unless dynamic
- **Use semantic class names**

### 4. Performance

- **Memoize expensive calculations** with `useMemo`
- **Debounce/throttle** frequent events
- **Use `useCallback`** for event handlers
- **Minimize dependencies** in `useEffect`

---

## Integration with YooptaEditor

All components integrate seamlessly with YooptaEditor:

```tsx
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { FloatingBlockActions, BlockOptions, Toolbar, ActionMenuList } from '@yoopta/ui';

const Editor = () => {
  const editor = useMemo(() => createYooptaEditor(), []);

  return (
    <YooptaEditor editor={editor} plugins={plugins}>
      <FloatingBlockActionsComponent />
      <BlockOptionsComponent />
      <ToolbarComponent />
      <ActionMenuListComponent />
    </YooptaEditor>
  );
};
```

---

## Future Enhancements

### Planned Features

1. **ActionMenu** - Improved action menu with categories
2. **LinkTool** - Inline link editor
3. **ElementPropsEditor** - Edit block properties
4. **ColorPicker** - Color selection for text/background
5. **EmojiPicker** - Emoji selection

### Architectural Improvements

1. **Shared utilities** - Common hooks and helpers
2. **Theme system** - Centralized theming
3. **Animation system** - Reusable animations
4. **Accessibility** - ARIA improvements
5. **Performance** - Further optimizations

---

## Contributing

When adding a new component:

1. Create a new directory in `src/`
2. Add `store.ts`, `hooks.ts`, `component.tsx`, `component.css`
3. Write unit tests in `store.test.ts`
4. Add documentation in `README.md`
5. Export from `index.ts`
6. Update main `src/index.ts`

---

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Floating UI Documentation](https://floating-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Yoopta Editor](https://github.com/Darginec05/Yoopta-Editor)
