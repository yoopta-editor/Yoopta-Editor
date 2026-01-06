import { ACTION_MENU_LIST_DEFAULT_ICONS_MAP } from '@/icons/icons';
import { SlashCommandMenu } from '@yoopta/ui';
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

const BLOCK_ITEMS = [
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

export const YooptaSlashCommandMenu = () => (
  <SlashCommandMenu.Root items={BLOCK_ITEMS}>
    <SlashCommandMenu.Content>
      <SlashCommandMenu.List>
        <SlashCommandMenu.Empty>No blocks found</SlashCommandMenu.Empty>
        {BLOCK_ITEMS.map((item) => (
          <SlashCommandMenu.Item
            key={item.id}
            value={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </SlashCommandMenu.List>
      <SlashCommandMenu.Footer />
    </SlashCommandMenu.Content>
  </SlashCommandMenu.Root>
);
