# Tabs plugin

Tabs is plugin for Yoopta-Editor

### Installation

```bash
yarn add @yoopta/tabs
```

### Usage

```jsx
import Tabs from '@yoopta/tabs';

const plugins = [Tabs];

const Editor = () => {
  return <YooptaEditor plugins={plugins} />;
};
```

### Default classnames

- .yoopta-tabs
- .yoopta-tabs-theme-['default' | 'success' | 'warning' | 'error' | 'info']

### Default options

```js
const Tabs = new YooptaPlugin({
  options: {
    display: {
      title: 'Tabs',
      description: 'Make writing stand out',
    },
    shortcuts: ['<'],
  },
});
```

### How to extend

```tsx
const plugins = [
  Tabs.extend({
    renders: {
      tabs: (props) => <YourCustomComponent {...props} />
    },
    options: {
      shortcuts: [`<your custom shortcuts>`],
      display: {
        title: `<your custom title>`,
        description: `<your custom description>`,
      },
      HTMLAttributes: {
        className: '<your classname>',
        // ...other HTML attributes
      },
    },
  });
];
```
