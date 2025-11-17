# SlashActionMenuList Testing Guide

Comprehensive test suite for SlashActionMenuList component.

## 📋 Test Coverage

### Unit Tests

#### Store Tests (`store.test.ts`)

- ✅ Initial state verification
- ✅ `open()` functionality
- ✅ `close()` functionality
- ✅ `setSearchText()` functionality
- ✅ `setSelectedIndex()` functionality
- ✅ `reset()` functionality
- ✅ Singleton behavior (shared state)

#### Hook Tests (`hooks.test.tsx`)

- ✅ `useSlashActionMenuActions` initial state
- ✅ `open()` with/without reference
- ✅ `close()` functionality
- ✅ `isOpen` state synchronization
- ✅ Multiple instances sharing state
- ✅ Performance (re-render optimization)

### Component Tests (`slash-action-menu-list.test.tsx`)

#### SlashActionMenuList.Root

- ✅ Renders children
- ✅ Applies custom styles
- ✅ Has correct role attribute
- ✅ Stops event propagation

#### SlashActionMenuList.Group

- ✅ Renders children
- ✅ Applies correct CSS class

#### SlashActionMenuList.Item

- ✅ Renders action title
- ✅ Renders action description
- ✅ Applies selected state
- ✅ Renders icons (ReactElement, string/URL)
- ✅ Button type attribute

#### SlashActionMenuList.Empty

- ✅ Renders default empty message
- ✅ Applies correct CSS class

#### Integration

- ✅ Complete menu structure
- ✅ Empty state rendering

---

## 🚀 Running Tests

### Run all tests

```bash
# From project root
yarn test:ui

# Or specific package
cd packages/core/ui
yarn test
```

### Run specific test file

```bash
yarn test store.test.ts
yarn test hooks.test.tsx
yarn test slash-action-menu-list.test.tsx
```

### Watch mode

```bash
yarn test --watch
```

### Coverage report

```bash
yarn test --coverage
```

---

## 📊 Coverage Goals

| Category   | Goal | Current |
| ---------- | ---- | ------- |
| Statements | 90%+ | -       |
| Branches   | 85%+ | -       |
| Functions  | 90%+ | -       |
| Lines      | 90%+ | -       |

---

## 🧪 Test Structure

### Store Tests Pattern

```typescript
describe('SlashActionMenuStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSlashActionMenuStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should...', () => {
    // Test implementation
  });
});
```

### Hook Tests Pattern

```typescript
describe('useSlashActionMenuActions', () => {
  it('should...', () => {
    const { result } = renderHook(() => useSlashActionMenuActions());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });
});
```

### Component Tests Pattern

```typescript
describe('SlashActionMenuList.Item', () => {
  it('should render action title', () => {
    render(<SlashActionMenuList.Item action={mockAction} />);
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });
});
```

---

## 🔍 What's Tested

### Store

- ✅ State initialization
- ✅ State mutations
- ✅ State persistence across instances
- ✅ Reset functionality

### Hooks

- ✅ Lightweight hook (`useSlashActionMenuActions`)
- ✅ Open/close functionality
- ✅ Reference handling
- ✅ State synchronization
- ✅ Multiple instances

### Components

- ✅ Rendering
- ✅ Props handling
- ✅ Event handling
- ✅ CSS classes
- ✅ Accessibility attributes
- ✅ Integration scenarios

---

## 🚫 What's NOT Tested (E2E tests needed)

These require E2E tests with Playwright:

- ❌ Full hook with Floating UI (`useSlashActionMenu`)
- ❌ Keyboard navigation (Arrow keys, Enter, Escape)
- ❌ Slash command trigger (`/` key)
- ❌ Text filtering while typing
- ❌ Auto-close on empty results
- ❌ Positioning with Floating UI
- ❌ Integration with YooptaEditor

---

## 📝 Adding New Tests

### 1. For Store

Add to `store.test.ts`:

```typescript
it('should handle new action', () => {
  const { result } = renderHook(() => useSlashActionMenuStore());

  act(() => {
    result.current.newAction();
  });

  expect(result.current.someState).toBe(expectedValue);
});
```

### 2. For Hooks

Add to `hooks.test.tsx`:

```typescript
it('should handle new behavior', () => {
  const { result } = renderHook(() => useSlashActionMenuActions());

  act(() => {
    result.current.newMethod();
  });

  expect(result.current.isOpen).toBe(true);
});
```

### 3. For Components

Add to `slash-action-menu-list.test.tsx`:

```typescript
it('should render new feature', () => {
  render(<SlashActionMenuList.NewComponent prop="value">Content</SlashActionMenuList.NewComponent>);

  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

---

## 🐛 Debugging Tests

### Failed test

```bash
# Run specific test
yarn test -t "should open the menu"

# Run with verbose output
yarn test --verbose

# Run with coverage
yarn test --coverage --verbose
```

### Check test output

```typescript
it('debug test', () => {
  const { result } = renderHook(() => useSlashActionMenuStore());

  console.log('Initial state:', result.current);

  act(() => {
    result.current.open();
  });

  console.log('After open:', result.current);
});
```

---

## ✅ Best Practices

1. **Reset store before each test**

   ```typescript
   beforeEach(() => {
     const { result } = renderHook(() => useSlashActionMenuStore());
     act(() => result.current.reset());
   });
   ```

2. **Use descriptive test names**

   ```typescript
   it('should close menu and reset state when close() is called', () => {
     // Test
   });
   ```

3. **Test one thing per test**

   ```typescript
   // Good
   it('should open the menu', () => {
     /* ... */
   });
   it('should set reference', () => {
     /* ... */
   });

   // Bad
   it('should open menu and set reference and update state', () => {
     /* ... */
   });
   ```

4. **Use act() for state updates**

   ```typescript
   act(() => {
     result.current.open();
   });
   ```

5. **Clean up after tests**
   ```typescript
   afterEach(() => {
     cleanup();
   });
   ```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Zustand Stores](https://docs.pmnd.rs/zustand/guides/testing)
- [Testing React Hooks](https://react-hooks-testing-library.com/)

---

## 🎯 Next Steps

1. Run tests and ensure all pass
2. Check coverage report
3. Add E2E tests for keyboard navigation
4. Add integration tests with YooptaEditor
5. Add accessibility tests
