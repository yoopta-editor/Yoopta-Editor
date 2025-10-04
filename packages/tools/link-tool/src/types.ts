import type { YooEditor } from '@yoopta/editor';

export type Link = {
  url: string;
  title: string;
  rel?: string;
  target?: string;
};

export type LinkToolRenderProps = {
  editor: YooEditor;
  link: Link;
  withLink?: boolean;
  withTitle?: boolean;
  onSave: (link: Link) => void;
  onDelete: () => void;
};
