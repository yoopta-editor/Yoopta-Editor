# HighlightColor

A modern color picker component for text and background highlighting in Yoopta Editor, featuring preset colors and custom color selection.

## Features

- 🎨 Preset colors for text and background highlighting
- 🎯 Custom color picker with debounced updates
- 📱 Responsive design with mobile support
- 🌙 Dark theme support
- ⚡ Smooth animations and transitions
- ♿ Fully accessible with keyboard navigation
- 🎭 Tab-based interface for text and background colors

## Installation

```bash
npm install @yoopta/ui
```

## Usage

### Basic Usage

```tsx
import { HighlightColor, useHighlightColor } from '@yoopta/ui';

const MyComponent = () => {
  const { highlightColors, setHighlightColors, applyHighlightColor } = useHighlightColor({
    editor: editorInstance,
    onColorChange: (colors) => console.log('Colors changed:', colors),
  });

  return (
    <HighlightColor
      editor={editorInstance}
      highlightColors={highlightColors}
      refs={floatingRefs}
      floatingStyles={floatingStyles}
      onClose={handleClose}
    />
  );
};
```

### With Custom Configuration

```tsx
import { HighlightColor } from '@yoopta/ui';

const MyComponent = () => {
  return (
    <HighlightColor
      editor={editorInstance}
      highlightColors={{
        textColor: '#ff0000',
        backgroundColor: '#ffff00',
      }}
      refs={floatingRefs}
      floatingStyles={floatingStyles}
      onClose={handleClose}
      className="my-custom-highlight"
      style={{ zIndex: 1000 }}
    />
  );
};
```

### Using the Hook Directly

```tsx
import { useHighlightColor } from '@yoopta/ui';

const MyComponent = () => {
  const { highlightColors, setHighlightColors, applyHighlightColor, isOpen, openColorPicker, closeColorPicker } =
    useHighlightColor({
      editor: editorInstance,
      initialColors: {
        textColor: '#000000',
        backgroundColor: 'transparent',
      },
      onColorChange: (colors) => {
        console.log('Text color:', colors.textColor);
        console.log('Background color:', colors.backgroundColor);
      },
      debounceMs: 300,
    });

  const handleTextColorChange = (color: string) => {
    setHighlightColors((prev) => ({ ...prev, textColor: color }));
    applyHighlightColor('text', color);
  };

  const handleBackgroundColorChange = (color: string) => {
    setHighlightColors((prev) => ({ ...prev, backgroundColor: color }));
    applyHighlightColor('background', color);
  };

  return (
    <div>
      <button onClick={openColorPicker}>Open Color Picker</button>
      {isOpen && <div className="color-picker-container">{/* Custom color picker UI */}</div>}
    </div>
  );
};
```

## API

### HighlightColor Component

The main color picker component.

```tsx
<HighlightColor
  editor: YooEditor
  highlightColors: CSSProperties
  refs: { setFloating: (node: HTMLElement | null) => void }
  floatingStyles: CSSProperties
  onClose?: () => void
  className?: string
  style?: CSSProperties
/>
```

## Hooks

### useHighlightColor

Provides highlight color state and handlers.

```tsx
const {
  highlightColors,
  setHighlightColors,
  applyHighlightColor,
  isOpen,
  openColorPicker,
  closeColorPicker
} = useHighlightColor({
  editor?: YooEditor,
  initialColors?: CSSProperties,
  onColorChange?: (colors: CSSProperties) => void,
  debounceMs?: number
});
```

## Props

### HighlightColor

| Prop              | Type              | Default | Description              |
| ----------------- | ----------------- | ------- | ------------------------ |
| `editor`          | `YooEditor`       | -       | Editor instance          |
| `highlightColors` | `CSSProperties`   | `{}`    | Current highlight colors |
| `refs`            | `{ setFloating }` | -       | Refs for positioning     |
| `floatingStyles`  | `CSSProperties`   | -       | Positioning styles       |
| `onClose`         | `() => void`      | -       | Close callback           |
| `className`       | `string`          | -       | Additional CSS classes   |
| `style`           | `CSSProperties`   | -       | Inline styles            |

### useHighlightColor Options

| Prop            | Type                              | Default | Description                    |
| --------------- | --------------------------------- | ------- | ------------------------------ |
| `editor`        | `YooEditor`                       | -       | Editor instance                |
| `initialColors` | `CSSProperties`                   | `{}`    | Initial highlight colors       |
| `onColorChange` | `(colors: CSSProperties) => void` | -       | Color change callback          |
| `debounceMs`    | `number`                          | `300`   | Debounce delay in milliseconds |

## Preset Colors

### Text Colors

- **Default** (black)
- **Gray** (#787774)
- **Brown** (#976D57)
- **Orange** (#CC772F)
- **Yellow** (#C29243)
- **Green** (#548064)
- **Blue** (#477DA5)
- **Purple** (#A48BBE)
- **Pink** (#B35588)
- **Red** (#C4554D)

### Background Colors

- **Default** (unset)
- **Gray** (#F1F1EF)
- **Brown** (#F3EEEE)
- **Orange** (#F8ECDF)
- **Yellow** (#FAF3DD)
- **Green** (#EEF3ED)
- **Blue** (#E9F3F7)
- **Purple** (#F6F3F8)
- **Pink** (#F9F2F5)
- **Red** (#FAECEC)

## Design Features

- **Tab Interface**: Separate tabs for text and background colors
- **Preset Colors**: Quick access to commonly used colors
- **Custom Color Picker**: Advanced color selection with hex input
- **Debounced Updates**: Smooth performance with debounced color changes
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Automatic dark theme support
- **Accessibility**: Proper focus states and keyboard navigation

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --yoopta-ui-highlight-bg: hsl(0 0% 100%);
  --yoopta-ui-highlight-border: hsl(214.3 31.8% 91.4%);
  --yoopta-ui-highlight-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --yoopta-ui-highlight-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-highlight-tab-bg: transparent;
  --yoopta-ui-highlight-tab-text: hsl(215.4 16.3% 46.9%);
  --yoopta-ui-highlight-tab-hover-bg: hsl(210 40% 98%);
  --yoopta-ui-highlight-tab-active-bg: hsl(210 40% 96%);
  --yoopta-ui-highlight-tab-active-text: hsl(222.2 84% 4.9%);
  --yoopta-ui-highlight-border-color: #e3e3e3;
  --yoopta-ui-highlight-active-border: #3b82f6;
  --yoopta-ui-highlight-custom-toggle-text: hsl(215.4 16.3% 46.9%);
  --yoopta-ui-highlight-custom-toggle-hover-text: hsl(222.2 84% 4.9%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --yoopta-ui-highlight-bg: hsl(222.2 84% 4.9%);
    --yoopta-ui-highlight-text: hsl(210 40% 98%);
    --yoopta-ui-highlight-tab-text: hsl(215.4 16.3% 46.9%);
    --yoopta-ui-highlight-tab-hover-bg: hsl(217.2 32.6% 17.5%);
    --yoopta-ui-highlight-tab-active-bg: hsl(215.4 16.3% 46.9%);
    --yoopta-ui-highlight-tab-active-text: hsl(210 40% 98%);
  }
}
```

## Examples

### Basic Color Picker

```tsx
<HighlightColor
  editor={editor}
  highlightColors={currentColors}
  refs={floatingRefs}
  floatingStyles={floatingStyles}
  onClose={handleClose}
/>
```

### With Custom Styling

```tsx
<HighlightColor
  editor={editor}
  highlightColors={currentColors}
  refs={floatingRefs}
  floatingStyles={floatingStyles}
  onClose={handleClose}
  className="my-custom-highlight-picker"
  style={{
    zIndex: 1000,
    maxWidth: '300px',
  }}
/>
```

### Using Hook for Custom UI

```tsx
const MyCustomColorPicker = () => {
  const { highlightColors, setHighlightColors, applyHighlightColor } = useHighlightColor({
    editor: editorInstance,
    onColorChange: (colors) => {
      console.log('Text color:', colors.color);
      console.log('Background color:', colors.backgroundColor);
    },
  });

  return (
    <div className="custom-color-picker">
      <div className="text-colors">
        <h3>Text Colors</h3>
        {textColors.map((color) => (
          <button
            key={color.name}
            style={{ backgroundColor: color.value }}
            onClick={() => {
              setHighlightColors((prev) => ({ ...prev, color: color.value }));
              applyHighlightColor('text', color.value);
            }}
            aria-label={`Select ${color.name} text color`}
          />
        ))}
      </div>

      <div className="background-colors">
        <h3>Background Colors</h3>
        {backgroundColors.map((color) => (
          <button
            key={color.name}
            style={{ backgroundColor: color.value }}
            onClick={() => {
              setHighlightColors((prev) => ({ ...prev, backgroundColor: color.value }));
              applyHighlightColor('background', color.value);
            }}
            aria-label={`Select ${color.name} background color`}
          />
        ))}
      </div>
    </div>
  );
};
```

### With Custom Color Validation

```tsx
const MyComponent = () => {
  const { setHighlightColors, applyHighlightColor } = useHighlightColor({
    editor: editorInstance,
    onColorChange: (colors) => {
      // Validate colors before applying
      if (isValidColor(colors.color)) {
        applyHighlightColor('text', colors.color);
      }
      if (isValidColor(colors.backgroundColor)) {
        applyHighlightColor('background', colors.backgroundColor);
      }
    },
  });

  const handleColorChange = (type: 'text' | 'background', color: string) => {
    if (isValidColor(color)) {
      setHighlightColors((prev) => ({ ...prev, [type === 'text' ? 'color' : 'backgroundColor']: color }));
    }
  };

  return (
    <div>
      <input type="color" onChange={(e) => handleColorChange('text', e.target.value)} aria-label="Select text color" />
      <input
        type="color"
        onChange={(e) => handleColorChange('background', e.target.value)}
        aria-label="Select background color"
      />
    </div>
  );
};
```
