# Toolbar

Floating toolbar that appears when text or blocks are selected. Uses Zustand for state management.

## Architecture

**State Management**: All state (visibility, hold mode, styles) is stored in Zustand store (`useToolbarStore`).

**Hook**: `useToolbar()` initializes selection tracking logic and provides access to store data.

**Key Features**:

- ✅ Single hook for both logic and state access
- ✅ State stored in Zustand (no duplication when called multiple times)
- ✅ Automatic text and block selection tracking
- ✅ Hold mode to prevent closing when interacting with nested modals (e.g., link editor)
- ✅ Optimized performance with throttling
- ✅ Floating UI for smart positioning

## Usage

### Basic Example

```tsx
import { Toolbar, useToolbar } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';

function ToolbarComponent() {
  const editor = useYooptaEditor();
  const { setFloating, isMounted, styles } = useToolbar();

  if (!isMounted) return null;

  const toggleBold = () => editor.formats.bold?.toggle();
  const toggleItalic = () => editor.formats.italic?.toggle();
  const toggleUnderline = () => editor.formats.underline?.toggle();

  const isBoldActive = editor.formats.bold?.isActive();
  const isItalicActive = editor.formats.italic?.isActive();
  const isUnderlineActive = editor.formats.underline?.isActive();

  return (
    <Toolbar.Root ref={setFloating} style={styles}>
      <Toolbar.Group>
        <Toolbar.Button onClick={toggleBold} active={isBoldActive}>
          <FontBoldIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={toggleItalic} active={isItalicActive}>
          <FontItalicIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={toggleUnderline} active={isUnderlineActive}>
          <UnderlineIcon />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  );
}
```

### With Marks and Separators

```tsx
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from '@radix-ui/react-icons';

function FullToolbarComponent() {
  const editor = useYooptaEditor();
  const { setFloating, isMounted, styles } = useToolbar();

  if (!isMounted) return null;

  return (
    <Toolbar.Root ref={setFloating} style={styles}>
      {/* Text formatting group */}
      <Toolbar.Group>
        <Toolbar.Button
          onClick={() => editor.formats.bold?.toggle()}
          active={editor.formats.bold?.isActive()}>
          <FontBoldIcon />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => editor.formats.italic?.toggle()}
          active={editor.formats.italic?.isActive()}>
          <FontItalicIcon />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => editor.formats.underline?.toggle()}
          active={editor.formats.underline?.isActive()}>
          <UnderlineIcon />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => editor.formats.strike?.toggle()}
          active={editor.formats.strike?.isActive()}>
          <StrikethroughIcon />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => editor.formats.code?.toggle()}
          active={editor.formats.code?.isActive()}>
          <CodeIcon />
        </Toolbar.Button>
      </Toolbar.Group>

      <Toolbar.Separator />

      {/* Alignment group */}
      <Toolbar.Group>
        <Toolbar.Button onClick={() => console.log('Align left')}>
          <TextAlignLeftIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align center')}>
          <TextAlignCenterIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align right')}>
          <TextAlignRightIcon />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  );
}
```

### With Hold Mode (for nested modals)

When opening nested modals (like a link editor), use `setHold` to prevent the toolbar from closing:

```tsx
function ToolbarWithLinkEditor() {
  const editor = useYooptaEditor();
  const { setFloating, isMounted, styles, setHold } = useToolbar();
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!isMounted) return null;

  const openLinkModal = () => {
    setShowLinkModal(true);
    setHold(true); // Prevent toolbar from closing
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setHold(false); // Allow toolbar to close normally
  };

  return (
    <>
      <Toolbar.Root ref={setFloating} style={styles}>
        <Toolbar.Group>
          <Toolbar.Button onClick={openLinkModal}>Link</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>

      {showLinkModal && <LinkModal onClose={closeLinkModal} />}
    </>
  );
}
```

### Accessing State in Other Components

```tsx
function OtherComponent() {
  // Access store without re-initializing logic
  const { state, close } = useToolbar();

  const handleAction = () => {
    // Perform action
    close(); // Close toolbar after action
  };

  return <button onClick={handleAction}>Action (Toolbar is {state})</button>;
}
```

## API

### Toolbar

Compound component with subcomponents:

- `Toolbar.Root` - main container
- `Toolbar.Group` - group of related buttons
- `Toolbar.Separator` - visual separator between groups
- `Toolbar.Button` - action button

#### Toolbar.Root Props

```tsx
interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
  portal?: boolean; // Render in portal (default: true)
  portalContainer?: HTMLElement; // Custom portal container
}
```

#### Toolbar.Button Props

```tsx
interface ToolbarButtonProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean; // Whether button is in active state
  disabled?: boolean; // Whether button is disabled
  type?: 'button' | 'submit' | 'reset';
}
```

### useToolbar()

Hook that initializes selection tracking logic and provides access to store.

**Returns:**

```tsx
{
  // Floating UI refs
  setFloating: (node: HTMLElement | null) => void;
  isMounted: boolean; // Whether toolbar is mounted (for transitions)

  // State from store
  state: 'open' | 'closed';
  hold: boolean; // Whether toolbar is held open (ignores selection changes)
  styles: CSSProperties; // Calculated positioning styles

  // Actions
  open: (reference?: HTMLElement | null) => void;
  close: () => void;
  toggle: (state: 'open' | 'closed', reference?: HTMLElement | null) => void;
  setHold: (hold: boolean) => void;
  reset: () => void;
}
```

## Styling

Components use CSS classes:

- `.yoopta-ui-toolbar` - root container
- `.yoopta-ui-toolbar-group` - button group
- `.yoopta-ui-toolbar-separator` - separator
- `.yoopta-ui-toolbar-button` - button

### CSS Variables (shadcn style)

You can customize the appearance using CSS variables. The design system uses HSL color tokens for better theming:

#### Base Color Tokens

```css
:root {
  /* Base colors (HSL format without hsl()) */
  --yoopta-ui-background: 0 0% 100%;
  --yoopta-ui-foreground: 222.2 84% 4.9%;
  --yoopta-ui-border: 214.3 31.8% 91.4%;
  --yoopta-ui-accent: 210 40% 96.1%;
  --yoopta-ui-ring: 222.2 84% 4.9%;
  --yoopta-ui-primary: 221.2 83.2% 53.3%;
  --yoopta-ui-primary-foreground: 210 40% 98%;
}

.dark {
  --yoopta-ui-background: 222.2 84% 4.9%;
  --yoopta-ui-foreground: 210 40% 98%;
  --yoopta-ui-border: 217.2 32.6% 17.5%;
  --yoopta-ui-accent: 217.2 32.6% 17.5%;
  --yoopta-ui-ring: 212.7 26.8% 83.9%;
}
```

#### Component Variables

```css
:root {
  /* Toolbar */
  --yoopta-ui-toolbar-gap: 4px;
  --yoopta-ui-toolbar-padding: 6px;
  --yoopta-ui-toolbar-radius: 0.5rem;
  --yoopta-ui-toolbar-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --yoopta-ui-toolbar-z-index: 99;

  /* Group */
  --yoopta-ui-toolbar-group-gap: 2px;

  /* Separator */
  --yoopta-ui-toolbar-separator-height: 24px;
  --yoopta-ui-toolbar-separator-margin: 4px;

  /* Button */
  --yoopta-ui-toolbar-button-min-width: 32px;
  --yoopta-ui-toolbar-button-min-height: 32px;
  --yoopta-ui-toolbar-button-padding-y: 6px;
  --yoopta-ui-toolbar-button-padding-x: 8px;
  --yoopta-ui-toolbar-button-font-size: 0.875rem;
  --yoopta-ui-toolbar-button-font-weight: 500;
  --yoopta-ui-toolbar-button-gap: 4px;
  --yoopta-ui-toolbar-button-radius: 0.375rem;
  --yoopta-ui-toolbar-icon-size: 1rem;
  --yoopta-ui-toolbar-ring-offset: 2px;
}
```

### Customization Examples

#### Custom Theme Colors

```css
:root {
  /* Custom blue accent */
  --yoopta-ui-primary: 221.2 83.2% 53.3%;
  --yoopta-ui-accent: 210 40% 96.1%;
}
```

#### Larger Buttons

```css
:root {
  --yoopta-ui-toolbar-button-min-width: 36px;
  --yoopta-ui-toolbar-button-min-height: 36px;
  --yoopta-ui-toolbar-button-padding-y: 8px;
  --yoopta-ui-toolbar-button-padding-x: 12px;
  --yoopta-ui-toolbar-icon-size: 1.125rem;
}
```

## Automatic Tracking

The hook automatically tracks:

- Text selection via `selectionchange` event
- Block selection via `editor.path.selected`
- Scroll and focus changes
- Ignores selections inside custom editor blocks (with `[data-custom-editor]` attribute)

## Hold Behavior

Toolbar can be "held open" to prevent it from closing when interacting with nested UI:

- When a modal/popup opens (e.g., link editor), call `setHold(true)`
- The toolbar ignores selection changes while held
- When the modal closes, call `setHold(false)` to resume normal behavior

```tsx
const { setHold } = useToolbar();

// Open modal
setHold(true);

// Close modal
setHold(false);
```

This ensures a smooth UX when editing links, colors, or other properties - the toolbar stays visible and accessible.
