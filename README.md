[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/darginec05)

![npm](https://img.shields.io/npm/v/@yoopta/editor)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/Darginec05)

# Yoopta-Editor v6

![](/docs/public/yoopta_intro.gif)

## Introduction

Yoopta-Editor is a free, open-source rich-text editor built for React apps. It's packed with features that let you build an editor as powerful and user-friendly as Notion, Craft, Coda, Medium etc.

Built on top of Slate.js with a powerful plugin architecture, Yoopta-Editor gives you the flexibility to customize everything - tweak the look, add features, or craft a completely custom user interface.

## Features

- Easy setup with sensible defaults
- 18 powerful plugins out of the box
- Built on Slate.js for robust text editing
- Drag and drop with nested support
- Selection box for multi-block operations
- Mobile friendly
- Keyboard shortcuts and hotkeys (customizable)
- Indent/outdent with Tab/Shift+Tab
- Programmatic editor API for full control
- Real-time change events for database sync
- Export to HTML, Markdown, plain text
- Create custom plugins
- Media optimization with lazy loading
- Large document support
- Theming via CSS variables (light/dark)

## Installation

```bash
# Install peer dependencies and core packages
yarn add slate slate-react slate-dom @yoopta/editor

# Add plugins you need
yarn add @yoopta/paragraph @yoopta/headings @yoopta/lists @yoopta/blockquote @yoopta/code @yoopta/image @yoopta/video @yoopta/embed @yoopta/file @yoopta/callout @yoopta/divider @yoopta/accordion @yoopta/table @yoopta/tabs @yoopta/steps

# Add marks for text formatting
yarn add @yoopta/marks

# Add UI components
yarn add @yoopta/ui
```

## Quick Start

```tsx
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks';
import { useMemo, useState } from 'react';

const PLUGINS = [Paragraph, HeadingOne, HeadingTwo, HeadingThree];
const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({
    plugins: PLUGINS,
    marks: MARKS,
    // value: initialValue, // optional initial value
  }), []);

  return (
    <YooptaEditor
      editor={editor}
      placeholder="Type / to open menu"
      style={{ width: 750 }}
      onChange={(value) => console.log('onChange', value)}
    />
  );
}
```

## Adding UI Components

Yoopta provides ready-to-use UI components from `@yoopta/ui` that follow compound component patterns:

```tsx
import { useMemo, useState, useRef } from 'react';
import YooptaEditor, { createYooptaEditor, Blocks, Marks, useYooptaEditor } from '@yoopta/editor';
import { FloatingToolbar } from '@yoopta/ui/floating-toolbar';
import { FloatingBlockActions } from '@yoopta/ui/floating-block-actions';
import { BlockOptions } from '@yoopta/ui/block-options';
import { SlashActionMenuList } from '@yoopta/ui/slash-action-menu-list';

// Floating toolbar for text formatting
function MyToolbar() {
  const editor = useYooptaEditor();

  return (
    <FloatingToolbar>
      <FloatingToolbar.Content>
        <FloatingToolbar.Group>
          {editor.formats.bold && (
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'bold' })}
              active={Marks.isActive(editor, { type: 'bold' })}
            >
              B
            </FloatingToolbar.Button>
          )}
        </FloatingToolbar.Group>
      </FloatingToolbar.Content>
    </FloatingToolbar>
  );
}

// Floating block actions (plus button, drag handle)
function MyFloatingBlockActions() {
  const editor = useYooptaEditor();
  const [blockOptionsOpen, setBlockOptionsOpen] = useState(false);
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  return (
    <FloatingBlockActions frozen={blockOptionsOpen}>
      {({ blockId }) => (
        <>
          <FloatingBlockActions.Button
            onClick={() => {
              if (!blockId) return;
              const block = Blocks.getBlock(editor, { id: blockId });
              if (block) editor.insertBlock('Paragraph', { at: block.meta.order + 1, focus: true });
            }}
          >
            +
          </FloatingBlockActions.Button>
          <FloatingBlockActions.Button
            ref={dragHandleRef}
            onClick={() => setBlockOptionsOpen(true)}
          >
            ⋮⋮
          </FloatingBlockActions.Button>

          <BlockOptions
            open={blockOptionsOpen}
            onOpenChange={setBlockOptionsOpen}
            anchor={dragHandleRef.current}
          >
            <BlockOptions.Content>
              {/* Block options menu items */}
            </BlockOptions.Content>
          </BlockOptions>
        </>
      )}
    </FloatingBlockActions>
  );
}

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({
    plugins: PLUGINS,
    marks: MARKS,
  }), []);

  return (
    <YooptaEditor
      editor={editor}
      autoFocus
      placeholder="Type / to open menu"
      style={{ width: 750 }}
    >
      <MyToolbar />
      <MyFloatingBlockActions />
      <SlashActionMenuList />
    </YooptaEditor>
  );
}
```

## Packages

### Core

| Package | Description |
|---------|-------------|
| [@yoopta/editor](./packages/core/editor) | Core editor component and API |
| [@yoopta/ui](./packages/core/ui) | UI components (ActionMenuList, BlockOptions, ElementOptions, FloatingBlockActions, HighlightColorPicker, Overlay, Portal, SelectionBox, SlashMenuCommandMenu, FloatingToolbar) |
| [@yoopta/exports](./packages/core/exports) | Serializers for HTML, Markdown, PlainText, Email |
| [@yoopta/marks](./packages/marks) | Text formatting marks |

### Plugins

| Package | Description |
|---------|-------------|
| [@yoopta/paragraph](./packages/plugins/paragraph) | Basic text paragraph |
| [@yoopta/headings](./packages/plugins/headings) | H1, H2, H3 headings |
| [@yoopta/lists](./packages/plugins/lists) | Bulleted, numbered, and todo lists |
| [@yoopta/blockquote](./packages/plugins/blockquote) | Block quotes |
| [@yoopta/callout](./packages/plugins/callout) | Callout/alert boxes with themes |
| [@yoopta/code](./packages/plugins/code) | Code blocks with syntax highlighting |
| [@yoopta/image](./packages/plugins/image) | Images with optimization |
| [@yoopta/video](./packages/plugins/video) | Video embeds (YouTube, Vimeo, etc.) |
| [@yoopta/embed](./packages/plugins/embed) | Generic embeds (Figma, Twitter, etc.) |
| [@yoopta/file](./packages/plugins/file) | File attachments |
| [@yoopta/table](./packages/plugins/table) | Tables with headers |
| [@yoopta/accordion](./packages/plugins/accordion) | Collapsible accordion sections |
| [@yoopta/tabs](./packages/plugins/tabs) | Tabbed content panels |
| [@yoopta/steps](./packages/plugins/steps) | Step-by-step instructions |
| [@yoopta/divider](./packages/plugins/divider) | Visual dividers |
| [@yoopta/link](./packages/plugins/link) | Inline links |
| [@yoopta/mention](./packages/plugins/mention) | @mentions |
| [@yoopta/carousel](./packages/plugins/carousel) | Image carousels |

### Marks (Text Formatting)

All marks are available from `@yoopta/marks`:

- **Bold** - `Cmd/Ctrl + B`
- **Italic** - `Cmd/Ctrl + I`
- **Underline** - `Cmd/Ctrl + U`
- **Strike** - `Cmd/Ctrl + Shift + S`
- **CodeMark** - `Cmd/Ctrl + E`
- **Highlight** - Text highlighting with colors

### Styling

UI components use CSS variables for theming (shadcn/ui style):

```css
:root {
  --yoopta-ui-background: 0 0% 100%;
  --yoopta-ui-foreground: 222.2 84% 4.9%;
  --yoopta-ui-border: 214.3 31.8% 91.4%;
  --yoopta-ui-accent: 210 40% 96.1%;
}

.dark {
  --yoopta-ui-background: 222.2 84% 4.9%;
  --yoopta-ui-foreground: 210 40% 98%;
}
```

## Editor API

### Editor Instance

The editor instance provides programmatic control over content:

```tsx
const editor = useMemo(() => createYooptaEditor({
  plugins: PLUGINS,
  marks: MARKS,
  value: initialValue,
}), []);

// Element builder - create complex nested structures
const elements = editor.y('paragraph', {
  children: [
    editor.y.text('Hello '),
    editor.y.text('world', { bold: true, italic: true }),
  ],
});

// Inline elements (e.g., links)
const linkElement = editor.y.inline('link', {
  props: { url: 'https://example.com', target: '_blank' },
  children: [editor.y.text('Click here', { bold: true })],
});

// Insert block with elements
editor.insertBlock('Paragraph', { elements, at: 0, focus: true });

// Toggle block type (preserves content)
editor.toggleBlock('HeadingOne', { at: editor.path.current, focus: true });

// Batch multiple operations
editor.batchOperations(() => {
  editor.insertBlock('HeadingOne', { at: 0 });
  editor.insertBlock('Paragraph', { at: 1 });
});

// Export content
const html = editor.getHTML();
const markdown = editor.getMarkdown();
const plainText = editor.getPlainText();

// History
editor.undo();
editor.redo();

// Events
editor.on('change', (value) => console.log(value));
editor.on('focus', () => console.log('focused'));
editor.on('blur', () => console.log('blurred'));
```

### Blocks API

Namespace for block-level operations. Import: `import { Blocks } from '@yoopta/editor'`

```tsx
Blocks.insertBlock(editor, { ... })    // Insert a new block
Blocks.deleteBlock(editor, { ... })    // Delete a block
Blocks.updateBlock(editor, { ... })    // Update block properties
Blocks.moveBlock(editor, { ... })      // Move block to new position
Blocks.duplicateBlock(editor, { ... }) // Duplicate a block
Blocks.toggleBlock(editor, { ... })    // Change block type
Blocks.focusBlock(editor, { ... })     // Focus a specific block
Blocks.splitBlock(editor, { ... })     // Split block at cursor
Blocks.mergeBlock(editor, { ... })     // Merge with adjacent block
Blocks.increaseBlockDepth(editor, { ... }) // Indent block
Blocks.decreaseBlockDepth(editor, { ... }) // Outdent block
Blocks.getBlock(editor, { ... })       // Get block by ID
Blocks.getBlockSlate(editor, { ... })  // Get Slate instance for block
Blocks.buildBlockData(editor, { ... }) // Build block data structure
```

### Elements API

Namespace for element-level operations within blocks. Import: `import { Elements } from '@yoopta/editor'`

```tsx
Elements.insertElement(editor, { ... })   // Insert element in block
Elements.updateElement(editor, { ... })   // Update element properties
Elements.deleteElement(editor, { ... })   // Delete element
Elements.getElement(editor, { ... })      // Get element by matcher
Elements.getElements(editor, { ... })     // Get multiple elements
Elements.getElementEntry(editor, { ... }) // Get element with path
Elements.getElementPath(editor, { ... })  // Get path to element
Elements.getParentElementPath(editor, { ... }) // Get parent path
Elements.getElementChildren(editor, { ... })   // Get child elements
Elements.isElementEmpty(editor, { ... })  // Check if element is empty
```

### Marks API

Namespace for text formatting operations. Import: `import { Marks } from '@yoopta/editor'`

```tsx
// Apply marks to text at specific block positions
Marks.update(editor, {
  type: 'bold',
  value: true,
  at: [0, 1, 2], // block indices
});

// Apply highlight with custom styles
Marks.update(editor, {
  type: 'highlight',
  value: { color: 'red', backgroundColor: '#ffff00' },
  at: [0],
});
```

### Creating Custom Marks

```tsx
import { createYooptaMark } from '@yoopta/editor';

const CustomMark = createYooptaMark({
  type: 'custom',
  hotkey: 'mod+shift+c',
  render: (props) => <span className="custom-mark">{props.children}</span>,
});
```

## API Reference

### createYooptaEditor Options

```typescript
const editor = createYooptaEditor({
  plugins: YooptaPlugin[];        // List of plugins
  marks?: YooptaMark[];           // List of marks for text formatting
  value?: YooptaContentValue;     // Initial editor value
});
```

### YooptaEditor Props

```typescript
type YooptaEditorProps = {
  editor: YooEditor;              // Editor instance from createYooptaEditor()
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  onPathChange?: (path: YooptaPath) => void;
  autoFocus?: boolean;            // Default: true
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string | number;           // Useful for multiple editors
  selectionBoxElement?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;     // UI components (Toolbar, ActionMenu, etc.)
};
```

## Examples

- [Basic Setup](https://yoopta.dev/examples/withBaseFullSetup)
- [Custom Toolbar](https://yoopta.dev/examples/withCustomToolbar)
- [Notion-style Action Menu](https://yoopta.dev/examples/withNotionActionMenu)
- [Dark Theme](https://yoopta.dev/examples/withDarkTheme)
- [Media Plugins](https://yoopta.dev/examples/withMedia)
- [Extended Plugins](https://yoopta.dev/examples/withExtendedPlugin)
- [Read Only Mode](https://yoopta.dev/examples/withReadOnly)
- [Custom HTML Attributes](https://yoopta.dev/examples/withCustomHTMLAttributes)
- [Custom Marks](https://yoopta.dev/examples/withCustomMark)
- [Chat (Slack-style)](https://yoopta.dev/examples/withChatSlack)

## Project Structure

```
packages/
├── core/
│   ├── editor/       # @yoopta/editor - Main editor
│   ├── ui/           # @yoopta/ui - UI components
│   └── exports/      # @yoopta/exports - Serializers
├── plugins/          # Block plugins
├── marks/            # Text formatting marks
├── themes/           # Theme packages
└── development/      # Dev playground
```

## Development

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Start dev server with watch mode
yarn dev

# Run tests
yarn test

# Lint
yarn lint
```

## Roadmap

- AI tools for content generation
- Collaborative editing mode
- Simplified plugin API
- Additional plugins
- SEO optimizations

## Support

If you find Yoopta-Editor useful, consider supporting the project:

- Star this repository
- [Sponsor on GitHub](https://github.com/sponsors/Darginec05)
- [Buy me a coffee](https://www.buymeacoffee.com/darginec05)
- Share with others

## Contributing

- [Report bugs or request features](https://github.com/Darginec05/Yoopta-Editor/issues/new/choose)
- [Start a discussion](https://github.com/Darginec05/Yoopta-Editor/discussions/new/choose)
- [Join Discord](https://discord.gg/Dt8rhSTjsn)
- See [Contributing Guidelines](./CONTRIBUTING.md)

<a href="https://github.com/Darginec05/Yoopta-Editor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Darginec05/Yoopta-Editor" />
</a>

## License

[MIT License](./LICENSE)

## Contacts

- [Discord](https://discord.gg/Dt8rhSTjsn)
- [Twitter](https://twitter.com/LebovskiYoo)
- [GitHub](https://github.com/Darginec05)
