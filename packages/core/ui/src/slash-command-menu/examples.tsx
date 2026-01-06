/**
 * SLASH COMMAND MENU - USAGE EXAMPLES
 *
 * This file shows different ways to use the SlashCommand component.
 */

import React, { useMemo } from 'react';
import { YooptaEditor, createYooptaEditor } from '@yoopta/editor';
import {
  CheckSquare,
  Code,
  Columns,
  Heading1,
  Heading2,
  Heading3,
  Image,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table,
  ToggleRight,
  Type,
  Video,
} from 'lucide-react';

import type { SlashCommandItem as SlashCommandItemType } from './index';
import { SlashCommand } from './index';

// Icons (example with lucide-react)

// ============================================================================
// FULL EDITOR INTEGRATION EXAMPLE
// ============================================================================

// ============================================================================
// BLOCK ITEMS DEFINITION
// ============================================================================

const BLOCK_ITEMS: SlashCommandItemType[] = [
  // Basic blocks
  {
    id: 'Paragraph',
    title: 'Text',
    description: 'Just start writing with plain text.',
    icon: <Type size={20} />,
    keywords: ['paragraph', 'plain', 'text', 'p'],
    group: 'basic',
  },
  {
    id: 'HeadingOne',
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: <Heading1 size={20} />,
    keywords: ['h1', 'title', 'large', 'heading'],
    group: 'basic',
  },
  {
    id: 'HeadingTwo',
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: <Heading2 size={20} />,
    keywords: ['h2', 'subtitle', 'heading'],
    group: 'basic',
  },
  {
    id: 'HeadingThree',
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: <Heading3 size={20} />,
    keywords: ['h3', 'heading'],
    group: 'basic',
  },

  // List blocks
  {
    id: 'BulletedList',
    title: 'Bulleted List',
    description: 'Create a simple bulleted list.',
    icon: <List size={20} />,
    keywords: ['unordered', 'ul', 'bullet', 'list'],
    group: 'lists',
  },
  {
    id: 'NumberedList',
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: <ListOrdered size={20} />,
    keywords: ['ordered', 'ol', 'number', 'list'],
    group: 'lists',
  },
  {
    id: 'TodoList',
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    icon: <CheckSquare size={20} />,
    keywords: ['checkbox', 'task', 'todo', 'checklist'],
    group: 'lists',
  },
  {
    id: 'Toggle',
    title: 'Toggle List',
    description: 'Toggles can hide and show content.',
    icon: <ToggleRight size={20} />,
    keywords: ['collapse', 'expand', 'accordion', 'dropdown'],
    group: 'lists',
  },

  // Media blocks
  {
    id: 'Image',
    title: 'Image',
    description: 'Upload or embed with a link.',
    icon: <Image size={20} />,
    keywords: ['picture', 'photo', 'img', 'media'],
    group: 'media',
  },
  {
    id: 'Video',
    title: 'Video',
    description: 'Embed from YouTube, Vimeo, etc.',
    icon: <Video size={20} />,
    keywords: ['youtube', 'vimeo', 'embed', 'media'],
    group: 'media',
  },

  // Advanced blocks
  {
    id: 'Blockquote',
    title: 'Quote',
    description: 'Capture a quote.',
    icon: <Quote size={20} />,
    keywords: ['blockquote', 'citation', 'quote'],
    group: 'advanced',
  },
  {
    id: 'Code',
    title: 'Code Block',
    description: 'Capture a code snippet.',
    icon: <Code size={20} />,
    keywords: ['codeblock', 'snippet', 'programming', 'pre'],
    group: 'advanced',
  },
  {
    id: 'Divider',
    title: 'Divider',
    description: 'Visually divide blocks.',
    icon: <Minus size={20} />,
    keywords: ['hr', 'separator', 'line', 'horizontal'],
    group: 'advanced',
  },
  {
    id: 'Table',
    title: 'Table',
    description: 'Add a simple table.',
    icon: <Table size={20} />,
    keywords: ['grid', 'spreadsheet', 'rows', 'columns'],
    group: 'advanced',
  },
  {
    id: 'Columns',
    title: 'Columns',
    description: 'Create columns for layout.',
    icon: <Columns size={20} />,
    keywords: ['layout', 'grid', 'side', 'multi'],
    group: 'advanced',
  },
];

// ============================================================================
// EXAMPLE 1: Basic Usage (Flat List)
// ============================================================================

export const BasicSlashCommandMenu = () => (
  <SlashCommand.Root items={BLOCK_ITEMS}>
    <SlashCommand.Content>
      <SlashCommand.Input />
      <SlashCommand.List>
        <SlashCommand.Empty>No blocks found</SlashCommand.Empty>
        {BLOCK_ITEMS.map((item) => (
          <SlashCommand.Item
            key={item.id}
            value={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </SlashCommand.List>
      <SlashCommand.Footer />
    </SlashCommand.Content>
  </SlashCommand.Root>
);

// ============================================================================
// EXAMPLE 2: Grouped by Category
// ============================================================================

const GROUP_LABELS: Record<string, string> = {
  basic: 'Basic Blocks',
  lists: 'Lists',
  media: 'Media',
  advanced: 'Advanced',
};

export const GroupedSlashCommandMenu = () => {
  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SlashCommandItemType[]> = {};
    BLOCK_ITEMS.forEach((item) => {
      const group = item.group || 'other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, []);

  return (
    <SlashCommand.Root items={BLOCK_ITEMS}>
      <SlashCommand.Content>
        <SlashCommand.Input />
        <SlashCommand.List>
          <SlashCommand.Empty>No blocks found</SlashCommand.Empty>
          {Object.entries(groupedItems).map(([groupId, items]) => (
            <SlashCommand.Group key={groupId} heading={GROUP_LABELS[groupId] || groupId}>
              {items.map((item) => (
                <SlashCommand.Item
                  key={item.id}
                  value={item.id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </SlashCommand.Group>
          ))}
        </SlashCommand.List>
        <SlashCommand.Footer />
      </SlashCommand.Content>
    </SlashCommand.Root>
  );
};

// ============================================================================
// EXAMPLE 3: With Custom Selection Handler
// ============================================================================

export const CustomHandlerSlashCommandMenu = () => {
  const handleSelect = (item: SlashCommandItemType) => {
    console.log('Selected block:', item.id);
    // Custom logic here - the default behavior (toggleBlock)
    // will also run unless you prevent it in the item's onSelect
  };

  return (
    <SlashCommand.Root items={BLOCK_ITEMS} onSelect={handleSelect}>
      <SlashCommand.Content>
        <SlashCommand.Input placeholder="Type to search..." />
        <SlashCommand.List>
          <SlashCommand.Empty>
            <div>
              <span>🔍</span>
              <p>No matching blocks</p>
            </div>
          </SlashCommand.Empty>
          {BLOCK_ITEMS.map((item) => (
            <SlashCommand.Item
              key={item.id}
              value={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </SlashCommand.List>
        <SlashCommand.Footer />
      </SlashCommand.Content>
    </SlashCommand.Root>
  );
};

// ============================================================================
// EXAMPLE 4: Without Input (sync from editor only)
// ============================================================================

export const NoInputSlashCommandMenu = () => (
  <SlashCommand.Root items={BLOCK_ITEMS}>
    <SlashCommand.Content>
      <SlashCommand.List>
        <SlashCommand.Empty>No blocks found</SlashCommand.Empty>
        {BLOCK_ITEMS.map((item) => (
          <SlashCommand.Item
            key={item.id}
            value={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </SlashCommand.List>
      <SlashCommand.Footer />
    </SlashCommand.Content>
  </SlashCommand.Root>
);

// ============================================================================
// EXAMPLE 5: Custom Item Rendering
// ============================================================================

export const CustomItemSlashCommandMenu = () => (
  <SlashCommand.Root items={BLOCK_ITEMS}>
    <SlashCommand.Content>
      <SlashCommand.Input />
      <SlashCommand.List>
        <SlashCommand.Empty>No blocks found</SlashCommand.Empty>
        {BLOCK_ITEMS.map((item) => (
          <SlashCommand.Item key={item.id} value={item.id}>
            {/* Custom content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <small style={{ display: 'block', opacity: 0.7 }}>{item.description}</small>
              </div>
            </div>
          </SlashCommand.Item>
        ))}
      </SlashCommand.List>
    </SlashCommand.Content>
  </SlashCommand.Root>
);
// Import your plugins...

export const EditorWithSlashCommand = () => {
  const editor = useMemo(() => createYooptaEditor(), []);

  return (
    <YooptaEditor editor={editor} plugins={[]}>
      {/* Other editor UI... */}
      <GroupedSlashCommandMenu />
    </YooptaEditor>
  );
};
