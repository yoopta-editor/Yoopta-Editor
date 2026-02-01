export const PLUGIN_SLUGS = [
  'paragraph',
  'headings',
  'blockquote',
  'code',
  'code-group',
  'lists',
  'callout',
  'divider',
  'table',
  'table-of-contents',
  'tabs',
  'steps',
  'accordion',
  'image',
  'video',
  'file',
  'embed',
  'carousel',
  'mention',
  'link',
] as const;

export type PluginSlug = (typeof PLUGIN_SLUGS)[number];
