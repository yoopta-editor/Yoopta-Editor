# Portal

A portal component for rendering content outside the normal DOM hierarchy, useful for modals, tooltips, and floating UI elements.

## Features

- 🌐 Render content outside DOM hierarchy
- 🎯 Precise positioning and z-index management
- ♿ Maintains accessibility context
- 📱 Responsive and mobile-friendly
- ⚡ Lightweight and performant
- 🎭 Flexible container targeting

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { Portal } from '@yoopta/ui';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Modal Title</h2>
              <p>This content is rendered in a portal!</p>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
```

### With Custom Container

```tsx
import { Portal } from '@yoopta/ui';

const MyComponent = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create custom container
    const customContainer = document.createElement('div');
    customContainer.id = 'my-custom-portal';
    document.body.appendChild(customContainer);
    setContainer(customContainer);

    return () => {
      document.body.removeChild(customContainer);
    };
  }, []);

  return (
    <Portal container={container}>
      <div className="custom-portal-content">Content rendered in custom container</div>
    </Portal>
  );
};
```

### With Conditional Rendering

```tsx
import { Portal } from '@yoopta/ui';

const MyComponent = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover for tooltip
      </button>

      {showTooltip && (
        <Portal>
          <div
            className="tooltip"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)',
              zIndex: 1000,
            }}
          >
            This is a tooltip rendered in a portal!
          </div>
        </Portal>
      )}
    </div>
  );
};
```

### With Multiple Portals

```tsx
import { Portal } from '@yoopta/ui';

const MyComponent = () => {
  const [modals, setModals] = useState<{ id: string; isOpen: boolean }[]>([
    { id: 'modal1', isOpen: false },
    { id: 'modal2', isOpen: false },
  ]);

  const openModal = (id: string) => {
    setModals((prev) => prev.map((modal) => (modal.id === id ? { ...modal, isOpen: true } : modal)));
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.map((modal) => (modal.id === id ? { ...modal, isOpen: false } : modal)));
  };

  return (
    <div>
      <button onClick={() => openModal('modal1')}>Open Modal 1</button>
      <button onClick={() => openModal('modal2')}>Open Modal 2</button>

      {modals.map(
        (modal) =>
          modal.isOpen && (
            <Portal key={modal.id}>
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Modal {modal.id}</h2>
                  <p>Content for {modal.id}</p>
                  <button onClick={() => closeModal(modal.id)}>Close</button>
                </div>
              </div>
            </Portal>
          ),
      )}
    </div>
  );
};
```

## API

### Portal Component

The main portal component for rendering content outside the DOM hierarchy.

```tsx
<Portal
  container?: HTMLElement
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
>
  {/* Portal content */}
</Portal>
```

## Props

### Portal

| Prop        | Type                  | Default         | Description                 |
| ----------- | --------------------- | --------------- | --------------------------- |
| `container` | `HTMLElement`         | `document.body` | Target container for portal |
| `className` | `string`              | -               | Additional CSS classes      |
| `style`     | `React.CSSProperties` | -               | Inline styles               |
| `children`  | `ReactNode`           | -               | Portal content              |

## Design Features

- **DOM Isolation**: Renders content outside the normal DOM hierarchy
- **Z-Index Management**: Proper layering for overlays and modals
- **Accessibility**: Maintains focus management and screen reader context
- **Performance**: Lightweight implementation with minimal overhead
- **Flexibility**: Custom container targeting for specific use cases

## Examples

### Modal Implementation

```tsx
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

// Usage
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2>Modal Content</h2>
  <p>This content is rendered in a portal.</p>
</Modal>;
```

### Tooltip Implementation

```tsx
const Tooltip = ({ children, content, isVisible, position }) => {
  if (!isVisible) return children;

  return (
    <>
      {children}
      <Portal>
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
        >
          {content}
        </div>
      </Portal>
    </>
  );
};

// Usage
<Tooltip content="This is a tooltip!" isVisible={showTooltip} position={tooltipPosition}>
  <button>Hover me</button>
</Tooltip>;
```

### Notification System

```tsx
const NotificationPortal = ({ notifications }) => {
  return (
    <Portal>
      <div className="notification-container">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification">
            {notification.message}
          </div>
        ))}
      </div>
    </Portal>
  );
};

// Usage
<NotificationPortal notifications={notifications} />;
```

### Custom Container Portal

```tsx
const CustomPortal = ({ children }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const customContainer = document.createElement('div');
    customContainer.className = 'custom-portal-container';
    document.body.appendChild(customContainer);
    setContainer(customContainer);

    return () => {
      if (customContainer.parentNode) {
        customContainer.parentNode.removeChild(customContainer);
      }
    };
  }, []);

  if (!container) return null;

  return <Portal container={container}>{children}</Portal>;
};

// Usage
<CustomPortal>
  <div>Content in custom container</div>
</CustomPortal>;
```

### Loading Overlay

```tsx
const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <>
      {children}
      {isLoading && (
        <Portal>
          <div className="loading-overlay">
            <div className="loading-spinner">Loading...</div>
          </div>
        </Portal>
      )}
    </>
  );
};

// Usage
<LoadingOverlay isLoading={isLoading}>
  <div>Your content here</div>
</LoadingOverlay>;
```
