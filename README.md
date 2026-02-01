[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/darginec05)

![npm](https://img.shields.io/npm/v/@yoopta/editor)
[![Beta](https://img.shields.io/badge/status-beta-orange?style=flat)](https://github.com/Darginec05/Yoopta-Editor)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/Darginec05)

# Yoopta-Editor v6 (beta)

![](/docs/public/yoopta_intro.gif)

## Introduction

Yoopta-Editor is a free, open-source rich-text editor built for React apps. It's packed with features that let you build an editor as powerful and user-friendly as Notion, Craft, Coda, Medium etc.

Built on top of Slate.js with a powerful plugin architecture, Yoopta-Editor gives you the flexibility to customize everything - tweak the look, add features, or craft a completely custom user interface.

## Features

- Easy setup with sensible defaults
- 20+ plugins out of the box (paragraph, headings, lists, code, image, video, table, callout, and more)
- Headless core and plugins; optional themes (`@yoopta/themes-shadcn`, `@yoopta/themes-material`) for styled block UI
- Built with love for robust text editing
- Drag and drop with nested support
- Selection box for multi-block operations
- Mobile friendly
- Keyboard shortcuts and hotkeys (customizable)
- Indent/outdent with Tab/Shift+Tab
- Programmatic editor API for full control
- Real-time change events for database sync
- Export to HTML, Markdown, plain text, email
- Create custom plugins
- Media optimization with lazy loading
- Large document support
- Theming via CSS variables (light/dark); theme packages for plugin element styling

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

# Optional: theme for styled block UI (Shadcn or Material)
yarn add @yoopta/themes-shadcn
```

## Quick Start

Plugins and marks are passed to `createYooptaEditor`. Use `editor.setEditorValue(data)` for initial content and `onChange` to persist changes.

```tsx
import { useMemo, useEffect } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Headings from '@yoopta/headings';
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks';

const PLUGINS = [Paragraph, Headings.HeadingOne, Headings.HeadingTwo, Headings.HeadingThree];
const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor({ plugins: PLUGINS, marks: MARKS }), []);

  // Optional: set initial/loaded content
  // useEffect(() => { editor.setEditorValue(initialValue); }, [editor]);

  return (
    <YooptaEditor
      editor={editor}
      style={{ width: 750 }}
      placeholder="Type / to open menu"
      onChange={(value) => console.log('onChange', value)}
    />
  );
}
```

## Adding UI Components

All UI (toolbar, slash menu, block actions) must be **children** of `<YooptaEditor>` so they can use `useYooptaEditor()`. Yoopta provides ready-to-use components from `@yoopta/ui`:

```tsx
import { useMemo, useState, useRef } from 'react';
import YooptaEditor, { createYooptaEditor, Blocks, Marks, useYooptaEditor } from '@yoopta/editor';
import { FloatingToolbar, FloatingBlockActions, BlockOptions, SlashCommandMenu } from '@yoopta/ui';

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
              active={Marks.isActive(editor, { type: 'bold' })}>
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
            }}>
            +
          </FloatingBlockActions.Button>
          <FloatingBlockActions.Button
            ref={dragHandleRef}
            onClick={() => setBlockOptionsOpen(true)}>
            ⋮⋮
          </FloatingBlockActions.Button>

          <BlockOptions
            open={blockOptionsOpen}
            onOpenChange={setBlockOptionsOpen}
            anchor={dragHandleRef.current}>
            <BlockOptions.Content>{/* Block options menu items */}</BlockOptions.Content>
          </BlockOptions>
        </>
      )}
    </FloatingBlockActions>
  );
}

export default function Editor() {
  const editor = useMemo(
    () =>
      createYooptaEditor({
        plugins: PLUGINS,
        marks: MARKS,
      }),
    [],
  );

  return (
    <YooptaEditor
      editor={editor}
      autoFocus
      placeholder="Type / to open menu"
      style={{ width: 750 }}>
      <MyToolbar />
      <MyFloatingBlockActions />
      <SlashCommandMenu />
    </YooptaEditor>
  );
}
```

## Themes

The editor and plugins are **headless** by default. For styled block UI you can use a theme package:

- **`@yoopta/themes-shadcn`** — Shadcn UI styled components (production ready)
- **`@yoopta/themes-material`** — Material Design (in progress)

**Option 1: Apply theme to all plugins**

```tsx
import { applyTheme } from '@yoopta/themes-shadcn';

const plugins = applyTheme([
  Paragraph,
  Callout,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
]);
const editor = createYooptaEditor({ plugins, marks: MARKS });
```

**Option 2: Apply theme UI to a single plugin**

```tsx
import Callout from '@yoopta/callout';
import { CalloutUI } from '@yoopta/themes-shadcn/callout';

const CalloutWithUI = Callout.extend({ elements: CalloutUI });
// Use CalloutWithUI in your plugins array
```

See [docs/core/themes](https://docs.yoopta.dev/core/themes) for the full concept.

## Packages

### Core

| Package                                    | Description                                                                                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@yoopta/editor](./packages/core/editor)   | Core editor component and API (headless)                                                                                                            |
| [@yoopta/ui](./packages/core/ui)           | UI components (FloatingToolbar, ActionMenuList, SlashCommandMenu, FloatingBlockActions, BlockOptions, SelectionBox, BlockDndContext, SortableBlock) |
| [@yoopta/exports](./packages/core/exports) | Serializers for HTML, Markdown, PlainText, Email                                                                                                    |
| [@yoopta/marks](./packages/marks)          | Text formatting marks (Bold, Italic, Underline, Strike, Code, Highlight)                                                                            |

### Themes

| Package                                               | Description                                         |
| ----------------------------------------------------- | --------------------------------------------------- |
| [@yoopta/themes-shadcn](./packages/themes/shadcn)     | Shadcn UI styled block elements (production)        |
| [@yoopta/themes-material](./packages/themes/material) | Material Design styled block elements (in progress) |

### Plugins

| Package                                                           | Description                           |
| ----------------------------------------------------------------- | ------------------------------------- |
| [@yoopta/paragraph](./packages/plugins/paragraph)                 | Basic text paragraph                  |
| [@yoopta/headings](./packages/plugins/headings)                   | H1, H2, H3 headings                   |
| [@yoopta/lists](./packages/plugins/lists)                         | Bulleted, numbered, and todo lists    |
| [@yoopta/blockquote](./packages/plugins/blockquote)               | Block quotes                          |
| [@yoopta/callout](./packages/plugins/callout)                     | Callout/alert boxes with themes       |
| [@yoopta/code](./packages/plugins/code)                           | Code blocks with syntax highlighting  |
| [@yoopta/image](./packages/plugins/image)                         | Images with optimization              |
| [@yoopta/video](./packages/plugins/video)                         | Video embeds (YouTube, Vimeo, etc.)   |
| [@yoopta/embed](./packages/plugins/embed)                         | Generic embeds (Figma, Twitter, etc.) |
| [@yoopta/file](./packages/plugins/file)                           | File attachments                      |
| [@yoopta/table](./packages/plugins/table)                         | Tables with headers                   |
| [@yoopta/accordion](./packages/plugins/accordion)                 | Collapsible accordion sections        |
| [@yoopta/tabs](./packages/plugins/tabs)                           | Tabbed content panels                 |
| [@yoopta/steps](./packages/plugins/steps)                         | Step-by-step instructions             |
| [@yoopta/divider](./packages/plugins/divider)                     | Visual dividers                       |
| [@yoopta/link](./packages/plugins/link)                           | Inline links                          |
| [@yoopta/mention](./packages/plugins/mention)                     | @mentions                             |
| [@yoopta/carousel](./packages/plugins/carousel)                   | Image carousels                       |
| [@yoopta/table-of-contents](./packages/plugins/table-of-contents) | Table of contents block               |

### Marks (Text Formatting)

All marks are available from `@yoopta/marks`:

- **Bold** - `Cmd/Ctrl + B`
- **Italic** - `Cmd/Ctrl + I`
- **Underline** - `Cmd/Ctrl + U`
- **Strike** - `Cmd/Ctrl + Shift + S`
- **CodeMark** - `Cmd/Ctrl + E`
- **Highlight** - Text highlighting with colors

### Styling

UI components from `@yoopta/ui` use CSS variables for theming. For styled **block** elements (callout, code, image, etc.), use a theme package: `@yoopta/themes-shadcn` or `@yoopta/themes-material` (see [Themes](#themes) above).

CSS variables (shadcn/ui style):

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

The editor instance provides programmatic control over content. Use `editor.setEditorValue(data)` for initial/loaded content and `editor.getEditorValue()` (or the value from `onChange`) to read content.

```tsx
const editor = useMemo(
  () =>
    createYooptaEditor({
      plugins: PLUGINS,
      marks: MARKS,
      // value: initialValue,  // optional; or set later with setEditorValue()
    }),
  [],
);

// Set content after load
useEffect(() => {
  editor.setEditorValue(loadedValue);
}, [editor]);

// Element builder - create complex nested structures
const elements = editor.y('paragraph', {
  children: [editor.y.text('Hello '), editor.y.text('world', { bold: true, italic: true })],
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

// Content getter (or use value from onChange)
const value = editor.getEditorValue();

// Events
editor.on('change', ({ value, operations }) => console.log(value));
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
  plugins: YooptaPlugin[];         // Required. List of plugins
  marks?: YooptaMark[];            // Optional. Text formatting marks
  value?: YooptaContentValue;      // Optional. Initial content (or use setEditorValue later)
  readOnly?: boolean;
  id?: string;
});
```

### YooptaEditor Props

`plugins`, `marks`, and `value` are **not** props of `<YooptaEditor>`; they belong to `createYooptaEditor`. Use `editor.setEditorValue(data)` for initial content and `onChange` to persist.

```typescript
type YooptaEditorProps = {
  editor: YooEditor; // Required. From createYooptaEditor()
  onChange?: (value: YooptaContentValue, options: { operations }) => void;
  onPathChange?: (path: YooptaPath) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  renderBlock?: (props) => React.ReactNode; // e.g. for SortableBlock
  children?: React.ReactNode; // UI components: FloatingToolbar, SlashCommandMenu, etc.
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
