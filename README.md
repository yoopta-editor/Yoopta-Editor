[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/darginec05)

![npm](https://img.shields.io/npm/v/@yoopta/editor)
[![Beta](https://img.shields.io/badge/status-beta-orange?style=flat)](https://github.com/Darginec05/Yoopta-Editor)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/Darginec05)

# Yoopta-Editor v6 (beta)

![](/docs/public/yoopta_intro.gif)

## Motivation. Why Yoopta?

Yoopta is fully open source and built with all my heart and love. It was born from real pain

I've integrated rich-text editors into products more times than I'd like to admit. Every time it was the same story: wrestling with complex APIs, fighting against opinionated UI that doesn't fit your product, hacking around limitations, and writing glue code that makes you mass text your wife and check hair transplant prices (I'm currently accepting donations for the procedure — every star on GitHub brings me one follicle closer).

Yoopta was built to end that cycle. The idea is simple: give developers a **headless core** when they need full control, but also ship **20+ ready-made plugins**, **pre-built UI components** (toolbars, slash menus, block actions), and **theme presets** (shadcn, Material) — so you can launch a polished editing experience without thinking about implementing a rich-text editor in your project and engage in other business tasks

If Yoopta saves you time (and a few remaining hairs), consider [starring the repo](https://github.com/Darginec05/Yoopta-Editor) or [sponsoring the project](https://github.com/sponsors/Darginec05). It keeps the project alive — and my hairline hopeful.

## Introduction

Yoopta-Editor is a free, open-source rich-text editor built for React apps. It's packed with features that let you build an editor as powerful and user-friendly as Notion, Craft, Coda, Medium etc.

Built on top of Slate.js with a powerful plugin architecture, Yoopta-Editor gives you the flexibility to customize everything—tweak the look, add features, or craft a completely custom user interface. The core is headless by default; Yoopta also provides pre-built theme presets so you can get a full editing experience and start quickly (shadcn theme `@yoopta/themes-shadcn` is available now; Material theme is in progress). Pre-built UI components via `@yoopta/ui` (toolbars, menus, block actions) let you improve the editing experience without building everything from scratch.

## Features

- **Easy setup** — Sensible defaults; plugins and marks passed to `createYooptaEditor`, then render `<YooptaEditor />`
- **20+ plugins** — Paragraph, headings, lists, code, image, video, table, callout, accordion, tabs, steps, divider, embed, file, link, mention, carousel, table-of-contents, and more
- **Headless core** — Full control over UI; optional pre-built theme presets (`@yoopta/themes-shadcn` available, `@yoopta/themes-material` in progress) for styled block UI
- **Pre-built UI components** (`@yoopta/ui`) — FloatingToolbar, SlashCommandMenu, ActionMenuList, BlockOptions, FloatingBlockActions, SelectionBox, BlockDndContext so you don’t have to build everything from scratch
- **Blocks, Elements, Marks APIs** — Programmatic control: insert/update/delete blocks and elements, apply text formatting (Bold, Italic, Highlight, etc.), custom marks supported
- **Undo/redo** — Built-in history with `editor.undo()` / `editor.redo()`; batch operations for single undo step
- **Drag and drop** — Reorder blocks with nested depth support; optional `SortableBlock` for custom DnD
- **Selection box** — Multi-block selection for copy, delete, or bulk operations
- **Slash command & action menu** — Type `/` for block insertion; floating block actions (+, drag handle, block options)
- **Inline elements** — Links, @mentions, and custom inline nodes within text
- **Export** — HTML, Markdown, plain text, email template; get/set content as Yoopta JSON
- **Events** — `editor.on('change' | 'focus' | 'blur' | 'path-change' | 'block:copy')` for sync, analytics, or custom logic
- **Keyboard shortcuts** — Customizable hotkeys; Tab/Shift+Tab for indent/outdent; shortcuts per plugin and mark
- **Read-only mode** — Use the same editor instance for viewing or editing
- **TypeScript** — Full type definitions for editor, blocks, elements, and plugins
- **Mobile friendly** — Touch support; works in responsive layouts
- **Custom plugins & marks** — Define new block types or text formats and plug them in
- **Media & large docs** — Image/video optimization, lazy loading; performant with many blocks
- **Theming** — CSS variables (light/dark); theme packages for plugin element styling

## Installation

```bash
# Install peer dependencies and core packages
yarn add slate slate-react slate-dom @yoopta/editor

# Add plugins you need
yarn add @yoopta/paragraph @yoopta/headings @yoopta/lists @yoopta/blockquote @yoopta/code @yoopta/image @yoopta/video @yoopta/embed @yoopta/file @yoopta/callout @yoopta/divider @yoopta/accordion @yoopta/table @yoopta/tabs @yoopta/steps @yoopta/mention @yoopta/links

# Add marks for text formatting
yarn add @yoopta/marks

# Add UI components
yarn add @yoopta/ui

# Optional: theme for styled block UI (Shadcn or Material)
yarn add @yoopta/themes-shadcn
```

## Quick Start

Plugins, initial value and marks are passed to `createYooptaEditor`

```tsx
import { useMemo, useEffect } from 'react';
import YooptaEditor, { createYooptaEditor, type YooptaContentValue } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Headings from '@yoopta/headings';
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks';

const PLUGINS = [Paragraph, Headings.HeadingOne, Headings.HeadingTwo, Headings.HeadingThree];
const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

const initialValue = {} as YooptaContentValue;

const EDITOR_STYLES = {
  width: 750,
  // useful when you want to create default block by clicking on empty are
  paddingBottom: 150,
};

export default function Editor() {
  const editor = useMemo(
    () => createYooptaEditor({ plugins: PLUGINS, marks: MARKS, value: initialValue }),
    [],
  );

  return (
    <YooptaEditor
      editor={editor}
      style={EDITOR_STYLES}
      placeholder="Type / to open menu"
      onChange={(value) => console.log('onChange', value)}
    />
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

## Editor API

### Editor Instance

The editor instance provides programmatic control over content

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

`plugins`, `marks`, and `value` are **not** props of `<YooptaEditor>`; they belong to `createYooptaEditor`

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

Live demos and source code from the [next-app-example](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example) app:

- [Playground](https://yoopta.dev/playground) — Full setup: toolbar, slash menu, block actions, drag & drop, mentions ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/full-setup))
- [Rich Chat](https://yoopta.dev/playground/ai-chat) — WhatsApp/Telegram-like messaging with rich text, code blocks, reactions ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/ai-chat))
- [Word Example](https://yoopta.dev/playground/word-example) — Word-like editor with fixed toolbar, tables, images ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/word-example))
- [Slack Chat](https://yoopta.dev/playground/slack-chat) — Slack-style channel list and message composer ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/slack-chat))
- [README Editor](https://yoopta.dev/playground/readme-editor) — Split view with live Markdown preview ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/readme-editor))
- [Email Builder](https://yoopta.dev/playground/email-builder) — Email composition with blocks and export ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/examples/email-builder))
- [Plugin demos](https://yoopta.dev/playground/plugin/paragraph) — Per-plugin live demos (e.g. [paragraph](https://yoopta.dev/playground/plugin/paragraph), [callout](https://yoopta.dev/playground/plugin/callout)) ([source](https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/plugin-demo))

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
