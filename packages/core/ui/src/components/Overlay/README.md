# Overlay

A versatile overlay component for Yoopta Editor, providing backdrop functionality for modals, dropdowns, and other floating UI elements.

## Features

- 🎭 Backdrop functionality for modals and dropdowns
- 🎨 Customizable backdrop styling and behavior
- ♿ Proper focus management and accessibility
- 📱 Responsive and mobile-friendly
- ⚡ Smooth animations and transitions
- 🎯 Click outside to close functionality
- 🌙 Dark theme support

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { Overlay } from '@yoopta/ui';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <Overlay onClose={() => setIsOpen(false)}>
          <div className="modal-content">
            <h2>Modal Title</h2>
            <p>This content is displayed over the overlay!</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
};
```

### With Custom Backdrop

```tsx
import { Overlay } from '@yoopta/ui';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open with Custom Backdrop</button>

      {isOpen && (
        <Overlay
          onClose={() => setIsOpen(false)}
          backdropClassName="custom-backdrop"
          backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          closeOnBackdropClick={true}
        >
          <div className="modal-content">
            <h2>Custom Backdrop Modal</h2>
            <p>This modal has a custom backdrop style.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
};
```

### With Animation

```tsx
import { Overlay } from '@yoopta/ui';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Animated Modal</button>

      {isOpen && (
        <Overlay onClose={() => setIsOpen(false)} animate={true} animationDuration={300}>
          <div className="animated-modal-content">
            <h2>Animated Modal</h2>
            <p>This modal has smooth animations.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
};
```

### With Custom Close Behavior

```tsx
import { Overlay } from '@yoopta/ui';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    // Custom close logic
    console.log('Closing overlay...');
    setIsOpen(false);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    // Custom backdrop click logic
    console.log('Backdrop clicked');
    if (confirm('Are you sure you want to close?')) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open with Custom Close</button>

      {isOpen && (
        <Overlay
          onClose={handleClose}
          onBackdropClick={handleBackdropClick}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        >
          <div className="modal-content">
            <h2>Custom Close Modal</h2>
            <p>This modal has custom close behavior.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </Overlay>
      )}
    </div>
  );
};
```

### With Multiple Overlays

```tsx
import { Overlay } from '@yoopta/ui';

const MyComponent = () => {
  const [overlays, setOverlays] = useState<{ id: string; isOpen: boolean }[]>([
    { id: 'overlay1', isOpen: false },
    { id: 'overlay2', isOpen: false },
  ]);

  const openOverlay = (id: string) => {
    setOverlays((prev) => prev.map((overlay) => (overlay.id === id ? { ...overlay, isOpen: true } : overlay)));
  };

  const closeOverlay = (id: string) => {
    setOverlays((prev) => prev.map((overlay) => (overlay.id === id ? { ...overlay, isOpen: false } : overlay)));
  };

  return (
    <div>
      <button onClick={() => openOverlay('overlay1')}>Open Overlay 1</button>
      <button onClick={() => openOverlay('overlay2')}>Open Overlay 2</button>

      {overlays.map(
        (overlay) =>
          overlay.isOpen && (
            <Overlay
              key={overlay.id}
              onClose={() => closeOverlay(overlay.id)}
              zIndex={overlay.id === 'overlay1' ? 1000 : 1001}
            >
              <div className="modal-content">
                <h2>Overlay {overlay.id}</h2>
                <p>Content for {overlay.id}</p>
                <button onClick={() => closeOverlay(overlay.id)}>Close</button>
              </div>
            </Overlay>
          ),
      )}
    </div>
  );
};
```

## API

### Overlay Component

The main overlay component for backdrop functionality.

```tsx
<Overlay
  onClose?: () => void
  onBackdropClick?: (event: React.MouseEvent) => void
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  animate?: boolean
  animationDuration?: number
  backdropClassName?: string
  backdropStyle?: React.CSSProperties
  zIndex?: number
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
>
  {/* Overlay content */}
</Overlay>
```

## Props

### Overlay

| Prop                   | Type                                | Default | Description              |
| ---------------------- | ----------------------------------- | ------- | ------------------------ |
| `onClose`              | `() => void`                        | -       | Close callback           |
| `onBackdropClick`      | `(event: React.MouseEvent) => void` | -       | Backdrop click callback  |
| `closeOnBackdropClick` | `boolean`                           | `true`  | Close on backdrop click  |
| `closeOnEscape`        | `boolean`                           | `true`  | Close on escape key      |
| `animate`              | `boolean`                           | `true`  | Enable animations        |
| `animationDuration`    | `number`                            | `200`   | Animation duration in ms |
| `backdropClassName`    | `string`                            | -       | Backdrop CSS classes     |
| `backdropStyle`        | `React.CSSProperties`               | -       | Backdrop inline styles   |
| `zIndex`               | `number`                            | `1000`  | Z-index for overlay      |
| `className`            | `string`                            | -       | Additional CSS classes   |
| `style`                | `React.CSSProperties`               | -       | Inline styles            |
| `children`             | `ReactNode`                         | -       | Overlay content          |

## Design Features

- **Backdrop Functionality**: Semi-transparent backdrop for focus management
- **Smooth Animations**: Elegant fade-in and fade-out transitions
- **Accessibility**: Proper focus trapping and keyboard navigation
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Automatic dark theme support
- **Z-Index Management**: Proper layering for multiple overlays

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --yoopta-ui-overlay-bg: rgba(0, 0, 0, 0.5);
  --yoopta-ui-overlay-z-index: 1000;
  --yoopta-ui-overlay-transition: opacity 0.2s ease-in-out;
  --yoopta-ui-overlay-backdrop-filter: blur(2px);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-overlay-bg: rgba(0, 0, 0, 0.7);
  }
}
```

## Examples

### Modal Implementation

```tsx
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </Overlay>
  );
};

// Usage
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2>Modal Content</h2>
  <p>This content is displayed over the overlay.</p>
  <button onClick={() => setIsModalOpen(false)}>Close</button>
</Modal>;
```

### Dropdown Implementation

```tsx
const Dropdown = ({ isOpen, onClose, children, trigger }) => {
  return (
    <div className="dropdown-container">
      {trigger}
      {isOpen && (
        <Overlay onClose={onClose} closeOnBackdropClick={true}>
          <div className="dropdown-content">{children}</div>
        </Overlay>
      )}
    </div>
  );
};

// Usage
<Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} trigger={<button>Open Dropdown</button>}>
  <ul>
    <li>Option 1</li>
    <li>Option 2</li>
    <li>Option 3</li>
  </ul>
</Dropdown>;
```

### Loading Overlay

```tsx
const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <>
      {children}
      {isLoading && (
        <Overlay closeOnBackdropClick={false} closeOnEscape={false}>
          <div className="loading-content">
            <div className="spinner">Loading...</div>
          </div>
        </Overlay>
      )}
    </>
  );
};

// Usage
<LoadingOverlay isLoading={isLoading}>
  <div>Your content here</div>
</LoadingOverlay>;
```

### Confirmation Dialog

```tsx
const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  return (
    <Overlay onClose={onCancel}>
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </Overlay>
  );
};

// Usage
<ConfirmationDialog
  isOpen={showConfirmation}
  onConfirm={() => {
    console.log('Confirmed!');
    setShowConfirmation(false);
  }}
  onCancel={() => setShowConfirmation(false)}
  message="Are you sure you want to delete this item?"
/>;
```

### Custom Styled Overlay

```tsx
<Overlay
  onClose={handleClose}
  backdropClassName="custom-backdrop"
  backdropStyle={{
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)',
  }}
  className="custom-overlay"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <div className="custom-content">
    <h2>Custom Styled Overlay</h2>
    <p>This overlay has custom styling.</p>
  </div>
</Overlay>
```
