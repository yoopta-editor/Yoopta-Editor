# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
yarn install

# Build all packages (cleans dist directories first)
yarn build

# Development - runs packages in watch mode + dev server
yarn dev

# Run specific packages in watch mode only
PACKAGES="@yoopta/editor @yoopta/paragraph" yarn dev

# Run just the dev playground server
yarn serve
```

## Testing

```bash
yarn test              # Run all tests with Vitest
yarn test:run          # Single test run (no watch)
yarn test:watch        # Watch mode
yarn test:ui           # Vitest UI
yarn test:plugins      # Plugin tests only
yarn test:core         # Core package tests
yarn test:marks        # Mark tests
yarn test:integration  # Playwright e2e tests
yarn coverage          # Coverage report
```

## Linting & Formatting

```bash
yarn lint              # ESLint
yarn lint:fix          # ESLint with auto-fix
yarn prettier          # Format with Prettier
yarn format            # Run all formatters
```

## Architecture Overview

Yoopta-Editor is a React rich-text editor built on Slate.js with a plugin architecture.

### Monorepo Structure (Lerna + Yarn Workspaces)

```
packages/
├── core/
│   ├── editor/       # @yoopta/editor - Main editor component, YooEditor API
│   ├── ui/           # @yoopta/ui - Toolbar, ActionMenu, BlockOptions, etc.
│   └── exports/      # @yoopta/exports - HTML/Markdown/PlainText serializers
├── plugins/          # Block plugins (see list below)
├── marks/            # @yoopta/marks - Text formatting (Bold, Italic, etc.)
├── themes/           # Theme packages (base, material, shadcn)
└── development/      # Next.js dev playground
```

**Available Plugins**: accordion, blockquote, callout, carousel, code, divider, embed, file, headings, image, link, lists, mention, paragraph, steps, table, tabs, video

### YooEditor API

Created via `createYooptaEditor({ plugins, marks, value })`. Key methods:

**Block Operations**:
- `insertBlock`, `updateBlock`, `deleteBlock`, `duplicateBlock`
- `toggleBlock` - Change block type while preserving content
- `moveBlock`, `focusBlock`, `mergeBlock`, `splitBlock`
- `increaseBlockDepth`, `decreaseBlockDepth` - Nesting control
- `getBlock`

**Element Operations**:
- `insertElement`, `updateElement`, `deleteElement`
- `getElement`, `getElements`, `getElementEntry`, `getElementPath`
- `isElementEmpty`

**Element Builder** (`editor.y`):
```typescript
// Create block element
editor.y('paragraph', { props: {...}, children: [...] })

// Create text node with marks
editor.y.text('Hello', { bold: true, italic: true })

// Create inline element (e.g., link)
editor.y.inline('link', { props: { url: '...' }, children: [...] })
```

**Events**: `on`, `off`, `once`, `emit` for: `change`, `focus`, `blur`, `block:copy`, `path-change`

**Parsers**: `getHTML`, `getMarkdown`, `getPlainText`, `getEmail`

**History**: `undo`, `redo`, `batchOperations`

### Namespace APIs

Import from `@yoopta/editor`:

```typescript
import { Blocks, Elements, Marks, Selection } from '@yoopta/editor';
```

**Blocks API** - block-level operations:
```typescript
Blocks.insertBlock(editor, { ... })
Blocks.deleteBlock(editor, { ... })
Blocks.updateBlock(editor, { ... })
Blocks.moveBlock(editor, { ... })
Blocks.duplicateBlock(editor, { ... })
Blocks.toggleBlock(editor, { ... })
Blocks.focusBlock(editor, { ... })
Blocks.splitBlock(editor, { ... })
Blocks.mergeBlock(editor, { ... })
Blocks.increaseBlockDepth(editor, { ... })
Blocks.decreaseBlockDepth(editor, { ... })
Blocks.getBlock(editor, { ... })
Blocks.getBlockSlate(editor, { ... })
Blocks.buildBlockData(editor, { ... })
```

**Elements API** - element-level operations within blocks:
```typescript
Elements.insertElement(editor, { ... })
Elements.updateElement(editor, { ... })
Elements.deleteElement(editor, { ... })
Elements.getElement(editor, { ... })
Elements.getElements(editor, { ... })
Elements.getElementEntry(editor, { ... })
Elements.getElementPath(editor, { ... })
Elements.getParentElementPath(editor, { ... })
Elements.getElementChildren(editor, { ... })
Elements.isElementEmpty(editor, { ... })
```

**Marks API** - text formatting:
```typescript
Marks.update(editor, {
  type: 'highlight',
  value: { color: 'red', backgroundColor: '#ffff00' },
  at: [0, 1, 2], // block indices
});
```

### Data Model

```typescript
// Content structure
YooptaContentValue = Record<blockId, YooptaBlockData>

YooptaBlockData = {
  id: string;
  type: string;           // PascalCase: "Paragraph", "HeadingOne"
  value: SlateElement[];  // Slate elements with kebab-case types
  meta: { order, depth, align }
}

SlateElement = {
  id: string;
  type: string;           // kebab-case: "paragraph", "heading-one"
  children: Descendant[];
  props?: { nodeType: 'block' | 'inline' | 'void', ... }
}
```

### Key Files

- Main component: `packages/core/editor/src/yoopta-editor.tsx`
- Editor types: `packages/core/editor/src/editor/types.ts`
- Block operations: `packages/core/editor/src/editor/blocks/`
- Element operations: `packages/core/editor/src/editor/elements/`
- Plugin types: `packages/core/editor/src/plugins/types.ts`
- Dev playground: `packages/development/src/pages/dev/index.tsx`

### Usage Pattern

```tsx
const editor = useMemo(() => createYooptaEditor({
  plugins: PLUGINS,
  marks: MARKS,
  value: initialValue,
}), []);

<YooptaEditor
  editor={editor}
  onChange={(value, { operations }) => { ... }}
  placeholder="Type / to open menu"
  style={{ width: 750 }}
>
  <YooptaToolbar />
  <YooptaFloatingBlockActions />
  <YooptaSlashCommandMenu />
  <YooptaActionMenuList />
</YooptaEditor>
```

## AI Content Generation

When generating Yoopta content programmatically, see `YOOPTA_AI_SYSTEM_PROMPT.md` for the JSON format specification including all block types, validation rules, and common pitfalls.
