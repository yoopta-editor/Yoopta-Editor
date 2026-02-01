# Paragraph plugin

Paragraph is default plugin for Yoopta-Editor

### Installation

```bash
yarn add @yoopta/paragraph
```

### Usage

```jsx
import Paragraph from '@yoopta/paragraph';

const plugins = [Paragraph];

const Editor = () => {
  return <YooptaEditor plugins={plugins} />;
};
```

### Default classnames

- .yoopta-paragraph

### Default options

```js
const Paragraph = new YooptaPlugin({
  options: {
    display: {
      title: 'Text',
      description: 'Start writing plain text.',
    },
    shortcuts: ['p', 'text'],
  },
});
```

### How to extend

```tsx
const plugins = [
  Paragraph.extend({
    renders: {
      paragraph: (props) => <YourCustomComponent {...props} />
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
