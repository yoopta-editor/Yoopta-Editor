# Button

A versatile button component for Yoopta Editor with multiple variants and sizes, designed in the style of shadcn/ui.

## Features

- 🎨 Multiple style variants (default, outline, ghost, floating, etc.)
- 📏 Various sizes (sm, default, lg, icon, floating)
- ♿ Fully accessible with keyboard navigation
- 📱 Responsive and mobile-friendly
- 🌙 Dark theme support
- ⚡ Smooth hover and focus effects
- 🎭 Flexible composition with icons and text

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { Button } from '@yoopta/ui';

const MyComponent = () => {
  return (
    <div>
      <Button variant="default">Default Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="floating">Floating Button</Button>
    </div>
  );
};
```

### Different Sizes

```tsx
import { Button } from '@yoopta/ui';

const MyComponent = () => {
  return (
    <div>
      <Button size="sm">Small Button</Button>
      <Button size="default">Default Button</Button>
      <Button size="lg">Large Button</Button>
      <Button size="icon">
        <IconComponent />
      </Button>
      <Button size="floating">Floating Button</Button>
    </div>
  );
};
```

### With Icons

```tsx
import { Button } from '@yoopta/ui';
import { PlusIcon, TrashIcon, EditIcon } from 'lucide-react';

const MyComponent = () => {
  return (
    <div>
      <Button variant="default">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Item
      </Button>

      <Button variant="outline" size="sm">
        <EditIcon className="mr-2 h-4 w-4" />
        Edit
      </Button>

      <Button variant="destructive" size="icon">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
```

### With Event Handlers

```tsx
import { Button } from '@yoopta/ui';

const MyComponent = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered button');
  };

  return (
    <Button variant="default" onClick={handleClick} onMouseEnter={handleMouseEnter} disabled={false}>
      Click Me
    </Button>
  );
};
```

### Disabled State

```tsx
import { Button } from '@yoopta/ui';

const MyComponent = () => {
  return (
    <div>
      <Button variant="default" disabled>
        Disabled Button
      </Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="ghost" disabled>
        Disabled Ghost
      </Button>
    </div>
  );
};
```

## API

### Button Component

The main button component with various variants and sizes.

```tsx
<Button
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'floating'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'floating'
  disabled?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void
  children?: ReactNode
  ...rest?: ButtonHTMLAttributes<HTMLButtonElement>
>
  Button content
</Button>
```

## Props

### Button

| Prop           | Type                                                                                        | Default     | Description                  |
| -------------- | ------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| `variant`      | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'floating'` | `'default'` | Button style variant         |
| `size`         | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'floating'`                                         | `'default'` | Button size                  |
| `disabled`     | `boolean`                                                                                   | `false`     | Whether button is disabled   |
| `className`    | `string`                                                                                    | -           | Additional CSS classes       |
| `onClick`      | `(event: React.MouseEvent<HTMLButtonElement>) => void`                                      | -           | Click handler                |
| `onMouseEnter` | `(event: React.MouseEvent<HTMLButtonElement>) => void`                                      | -           | Mouse enter handler          |
| `onMouseLeave` | `(event: React.MouseEvent<HTMLButtonElement>) => void`                                      | -           | Mouse leave handler          |
| `onFocus`      | `(event: React.FocusEvent<HTMLButtonElement>) => void`                                      | -           | Focus handler                |
| `onBlur`       | `(event: React.FocusEvent<HTMLButtonElement>) => void`                                      | -           | Blur handler                 |
| `children`     | `ReactNode`                                                                                 | -           | Button content               |
| `...rest`      | `ButtonHTMLAttributes<HTMLButtonElement>`                                                   | -           | Additional button attributes |

## Variants

### Default

Standard button with solid background and hover effects.

```tsx
<Button variant="default">Default Button</Button>
```

### Destructive

Button for destructive actions with red styling.

```tsx
<Button variant="destructive">Delete</Button>
```

### Outline

Button with outlined border and transparent background.

```tsx
<Button variant="outline">Outline Button</Button>
```

### Secondary

Secondary button with subtle background.

```tsx
<Button variant="secondary">Secondary Button</Button>
```

### Ghost

Button with transparent background and hover effects.

```tsx
<Button variant="ghost">Ghost Button</Button>
```

### Link

Button that looks like a link.

```tsx
<Button variant="link">Link Button</Button>
```

### Floating

Button designed for floating UI elements.

```tsx
<Button variant="floating">Floating Button</Button>
```

## Sizes

### Small (sm)

Compact button size.

```tsx
<Button size="sm">Small Button</Button>
```

### Default

Standard button size.

```tsx
<Button size="default">Default Button</Button>
```

### Large (lg)

Larger button size.

```tsx
<Button size="lg">Large Button</Button>
```

### Icon

Square button optimized for icons.

```tsx
<Button size="icon">
  <IconComponent />
</Button>
```

### Floating

Size optimized for floating UI elements.

```tsx
<Button size="floating">Floating Button</Button>
```

## Design Features

- **Modern Aesthetics**: Clean, minimal design with subtle shadows and rounded corners
- **Smooth Animations**: Elegant hover and focus effects using CSS transitions
- **Color System**: HSL-based color palette with proper contrast ratios
- **Dark Mode**: Automatic dark theme support with `prefers-color-scheme`
- **Accessibility**: Proper focus states, keyboard navigation, and ARIA attributes
- **Responsive**: Adapts to different screen sizes and content lengths

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  /* Button base */
  --yoopta-ui-button-font-weight: 500;
  --yoopta-ui-button-border-radius: 0.5rem;
  --yoopta-ui-button-transition: all 0.2s ease-in-out;

  /* Default variant */
  --yoopta-ui-button-default-bg: hsl(222.2 84% 4.9%);
  --yoopta-ui-button-default-text: hsl(210 40% 98%);
  --yoopta-ui-button-default-hover-bg: hsl(222.2 84% 4.9% / 0.9);

  /* Destructive variant */
  --yoopta-ui-button-destructive-bg: hsl(0 84.2% 60.2%);
  --yoopta-ui-button-destructive-text: hsl(210 40% 98%);
  --yoopta-ui-button-destructive-hover-bg: hsl(0 84.2% 60.2% / 0.9);

  /* Outline variant */
  --yoopta-ui-button-outline-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-button-outline-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-button-outline-hover-bg: hsl(210 40% 98%);

  /* Ghost variant */
  --yoopta-ui-button-ghost-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-button-ghost-hover-bg: hsl(210 40% 98%);

  /* Floating variant */
  --yoopta-ui-button-floating-bg: rgba(0, 0, 0, 0.8);
  --yoopta-ui-button-floating-text: #ffffff;
  --yoopta-ui-button-floating-hover-bg: rgba(0, 0, 0, 0.9);

  /* Disabled state */
  --yoopta-ui-button-disabled-bg: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-button-disabled-text: hsl(215.4 16.3% 46.9%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-button-default-bg: hsl(210 40% 98%);
    --yoopta-ui-button-default-text: hsl(222.2 84% 4.9%);
    --yoopta-ui-button-default-hover-bg: hsl(210 40% 98% / 0.9);

    --yoopta-ui-button-outline-border: hsl(217.2 32.6% 17.5%);
    --yoopta-ui-button-outline-text: hsl(210 40% 98%);
    --yoopta-ui-button-outline-hover-bg: hsl(217.2 32.6% 17.5%);

    --yoopta-ui-button-ghost-text: hsl(210 40% 98%);
    --yoopta-ui-button-ghost-hover-bg: hsl(217.2 32.6% 17.5%);

    --yoopta-ui-button-floating-bg: rgba(255, 255, 255, 0.9);
    --yoopta-ui-button-floating-text: #000000;
    --yoopta-ui-button-floating-hover-bg: rgba(255, 255, 255, 1);
  }
}
```

## Examples

### Action Buttons

```tsx
<div className="button-group">
  <Button variant="default">
    <SaveIcon className="mr-2 h-4 w-4" />
    Save
  </Button>
  <Button variant="outline">
    <CancelIcon className="mr-2 h-4 w-4" />
    Cancel
  </Button>
  <Button variant="destructive">
    <TrashIcon className="mr-2 h-4 w-4" />
    Delete
  </Button>
</div>
```

### Icon Buttons

```tsx
<div className="icon-buttons">
  <Button variant="ghost" size="icon">
    <SettingsIcon className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="icon">
    <EditIcon className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="icon">
    <ShareIcon className="h-4 w-4" />
  </Button>
</div>
```

### Floating Action Buttons

```tsx
<div className="floating-actions">
  <Button variant="floating" size="floating">
    <PlusIcon className="h-4 w-4" />
  </Button>
  <Button variant="floating" size="floating">
    <EditIcon className="h-4 w-4" />
  </Button>
</div>
```

### Button Group

```tsx
<div className="button-group">
  <Button variant="outline" size="sm">
    Previous
  </Button>
  <Button variant="default" size="sm">
    Current
  </Button>
  <Button variant="outline" size="sm">
    Next
  </Button>
</div>
```

### Loading State

```tsx
<Button variant="default" disabled>
  <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Custom Styling

```tsx
<Button
  variant="default"
  className="my-custom-button"
  style={{
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    border: 'none',
  }}
>
  Custom Styled Button
</Button>
```
